-- ==========================================
-- SCRIPT DE CORREÇÃO TOTAL (DASHBOARD & LOGIN)
-- Rode este script INTEIRO no Editor SQL do Supabase
-- ==========================================

-- 1. GARANTIR QUE SEU PERFIL DE ADMIN EXISTE
-- Insere seu perfil na tabela se ele não existir
INSERT INTO public.profiles (id, email, full_name, org_role, last_seen, is_premium)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', 'Super Admin'), 
    'admin', 
    now(),
    true
FROM auth.users
WHERE email = 'paulofernandoautomacao@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET 
    org_role = 'admin', 
    is_premium = true,
    last_seen = now();

-- 2. FUNÇÃO SEGURA PARA VERIFICAR ADMIN
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE id = auth.uid() 
    AND email = 'paulofernandoautomacao@gmail.com'
  );
END;
$$ LANGUAGE plpgsql;

-- 3. CORRIGIR PERMISSÕES (RLS)
-- Remove políticas antigas que podem estar bloqueando
DROP POLICY IF EXISTS "Super Admin sees all" ON profiles;
DROP POLICY IF EXISTS "Super Admin updates all" ON profiles;
DROP POLICY IF EXISTS "Admin grants all" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Habilita RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política 1: Admin vê TUDO, Usuário comum vê só o dele
CREATE POLICY "Dashboard Policy" ON profiles
    FOR ALL
    USING (
        is_super_admin() OR auth.uid() = id
    );

-- 4. ATIVAR CRIAÇÃO AUTOMÁTICA DE PERFIL (Para Login Google)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, last_seen)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Novo Usuário'),
    new.email,
    now()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

-- Recria o gatilho
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. RESUMO
SELECT 
    count(*) as total_perfis, 
    (SELECT count(*) FROM auth.users) as total_usuarios_auth 
FROM profiles;
