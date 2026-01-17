-- =========================================================
-- SCRIPT DE CORREÇÃO: ADICIONAR COLUNA EMAIL E CORRIGIR PERFIL
-- Rode este script no Editor SQL do Supabase
-- =========================================================

-- 1. ADICIONAR A COLUNA EMAIL (Já que ela não existe)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. GARANTIR QUE SEU PERFIL DE ADMIN EXISTE (Agora com a coluna email criada)
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
    email = EXCLUDED.email, -- Atualiza o email se ele estava faltando
    org_role = 'admin', 
    is_premium = true,
    last_seen = now();

-- 3. FUNÇÃO PARA CRIAR NOVOS USUÁRIOS (Atualizada para gravar o email)
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

-- 4. POLÍTICAS DE SEGURANÇA (RLS)
-- Garante que o usuário consiga ler o próprio perfil e o Admin veja tudo
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Dashboard Policy" ON profiles;
CREATE POLICY "Dashboard Policy" ON profiles
    FOR ALL
    USING (
        (SELECT org_role FROM profiles WHERE id = auth.uid()) = 'admin' OR auth.uid() = id
    );
