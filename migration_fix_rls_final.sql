-- =========================================================
-- SOLUÇÃO DEFINITIVA DE ACESSO (PERMISSÃO POR EMAIL)
-- =========================================================

-- 1. Desativar segurança temporariamente para limpar políticas antigas
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Dashboard Policy" ON profiles;
DROP POLICY IF EXISTS "Admin Email Access" ON profiles;
DROP POLICY IF EXISTS "User Own Access" ON profiles;

-- 2. Garantir que os dados existem (Backfill de segurança para os 40 usuários)
INSERT INTO public.profiles (id, email, full_name, last_seen)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)),
    COALESCE(au.last_sign_in_at, au.created_at)
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = au.id
);

-- 3. Habilitar segurança novamente
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICA INDESTRUTÍVEL PARA O ADMIN (Baseada no Email direto)
-- Isso garante que SEU email sempre possa ver TUDO, sem depender de "roles" no banco.
CREATE POLICY "Admin Email Access" ON profiles
FOR ALL
USING (
  auth.jwt() ->> 'email' = 'paulofernandoautomacao@gmail.com'
);

-- 5. POLÍTICA PARA USUÁRIOS COMUNS (Ver o próprio perfil)
CREATE POLICY "User Own Access" ON profiles
FOR ALL
USING (
  auth.uid() = id
);
