-- migration_security_audit_fixes_2026.sql
-- Addressing findings from Security Assessment (2026-02-22)

-- ==========================================
-- 1. [CRÍTICO] PROTEÇÃO DE COLUNAS SENSÍVEIS (profiles)
-- ==========================================

CREATE OR REPLACE FUNCTION public.protect_profile_columns()
RETURNS TRIGGER AS $$
BEGIN
  -- Se o usuário for 'authenticated' (cliente), bloqueamos alteração de campos de privilégio e estrutura
  IF (current_setting('role') = 'authenticated') THEN
    
    -- Bloquear alteração de is_premium (VULNERABILIDADE 5)
    IF (OLD.is_premium IS DISTINCT FROM NEW.is_premium) THEN
        NEW.is_premium := OLD.is_premium;
    END IF;

    -- Bloquear alteração de is_system_admin (VULNERABILIDADE 1)
    IF (OLD.is_system_admin IS DISTINCT FROM NEW.is_system_admin) THEN
        NEW.is_system_admin := OLD.is_system_admin;
    END IF;

    -- Bloquear alteração de organization_id e org_role (Multi-tenancy protection)
    IF (OLD.organization_id IS DISTINCT FROM NEW.organization_id) THEN
        NEW.organization_id := OLD.organization_id;
    END IF;
    IF (OLD.org_role IS DISTINCT FROM NEW.org_role) THEN
        NEW.org_role := OLD.org_role;
    END IF;

    -- Bloquear alteração de daily_minutes_used
    IF (OLD.daily_minutes_used IS DISTINCT FROM NEW.daily_minutes_used) THEN
        NEW.daily_minutes_used := OLD.daily_minutes_used;
    END IF;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Garante que o trigger está aplicado
DROP TRIGGER IF EXISTS tr_protect_profile_columns ON public.profiles;
CREATE TRIGGER tr_protect_profile_columns
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_columns();


-- ==========================================
-- 2. [CRÍTICO] IDOR ESCRITA & RLS FINAL (profiles)
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Limpar políticas conflitantes
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "User Own Access" ON public.profiles;
DROP POLICY IF EXISTS "Admin Email Access" ON public.profiles;
DROP POLICY IF EXISTS "Org Admins can view their members" ON public.profiles;

-- Política de Leitura: Próprio perfil, Admin do Sistema, ou Admin da Organização
CREATE POLICY "profiles_secure_select" ON public.profiles 
FOR SELECT USING (
    id = auth.uid() 
    OR is_super_admin() 
    OR (
        organization_id IS NOT NULL 
        AND organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid() AND org_role = 'admin')
    )
);

-- Política de Escrita: Apenas o próprio usuário (sujeito ao trigger acima) ou Admin do Sistema
CREATE POLICY "profiles_secure_update" ON public.profiles 
FOR UPDATE USING (id = auth.uid() OR is_super_admin());


-- ==========================================
-- 3. [CRÍTICO] INFRAESTRUTURA DE PAGAMENTO (VULNERABILIDADE 5)
-- ==========================================

-- Criar tabela de assinaturas para validar o premium via server-side
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT,
    hotmart_purchase_id TEXT,
    status TEXT NOT NULL, -- 'active', 'canceled', 'past_due'
    plan_id TEXT,
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Apenas o dono pode ver sua assinatura
CREATE POLICY "subscriptions_owner_select" ON public.subscriptions 
FOR SELECT USING (user_id = auth.uid() OR is_super_admin());

-- Apenas o sistema/admin pode criar/atualizar assinaturas (SERVICE ROLE ou RPC SEGURO)
-- Sem política de INSERT/UPDATE para 'authenticated', forçando uso de Webhooks/Functions.


-- ==========================================
-- 4. [CRÍTICO] COUPONS RLS (VULNERABILIDADE 3)
-- ==========================================

DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'coupons') THEN
        ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Allow all users to read coupons" ON public.coupons;
        DROP POLICY IF EXISTS "Allow service role to manage coupons" ON public.coupons;
        DROP POLICY IF EXISTS "coupons_admin_all" ON public.coupons;
        DROP POLICY IF EXISTS "coupons_individual_select" ON public.coupons;

        -- Admins podem tudo
        CREATE POLICY "coupons_admin_all" ON public.coupons FOR ALL USING (is_super_admin());

        -- Usuários só podem VALIDAR (ver se existe e está ativo), sem listar todos
        CREATE POLICY "coupons_individual_select" ON public.coupons 
        FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));
    END IF;
END $$;


-- ==========================================
-- 5. [ALTO] PII EDU_TEACHERS & OUTROS (VULNERABILIDADE 4)
-- ==========================================

DO $$ 
BEGIN
    -- edu_teachers
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'edu_teachers') THEN
        ALTER TABLE public.edu_teachers ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "permit_all_teachers" ON public.edu_teachers;
        DROP POLICY IF EXISTS "teachers_auth_select" ON public.edu_teachers;
        DROP POLICY IF EXISTS "teachers_owner_update" ON public.edu_teachers;
        
        CREATE POLICY "teachers_auth_select" ON public.edu_teachers FOR SELECT USING (auth.role() = 'authenticated');
        CREATE POLICY "teachers_owner_update" ON public.edu_teachers FOR UPDATE USING (id = auth.uid() OR is_super_admin());
    END IF;

    -- edu_schools
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'edu_schools') THEN
        ALTER TABLE public.edu_schools ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "permit_all_schools" ON public.edu_schools;
        DROP POLICY IF EXISTS "schools_auth_select" ON public.edu_schools;
        
        CREATE POLICY "schools_auth_select" ON public.edu_schools FOR SELECT USING (auth.role() = 'authenticated');
    END IF;

    -- edu_invitations
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'edu_invitations') THEN
        ALTER TABLE public.edu_invitations ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "permit_all_invitations" ON public.edu_invitations;
        DROP POLICY IF EXISTS "invitations_secure_manage" ON public.edu_invitations;
        
        CREATE POLICY "invitations_secure_manage" ON public.edu_invitations 
        FOR ALL USING (
            is_super_admin() 
            OR EXISTS (SELECT 1 FROM public.edu_classes WHERE id = class_id AND teacher_id = auth.uid())
        );
    END IF;

    -- Organizations
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'organizations') THEN
        ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Members can view their own organization" ON public.organizations;
        DROP POLICY IF EXISTS "org_secure_select" ON public.organizations;
        
        CREATE POLICY "org_secure_select" ON public.organizations 
        FOR SELECT USING (
            id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()) 
            OR is_super_admin()
        );
    END IF;
END $$;

