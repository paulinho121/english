-- =============================================================
-- SCRIPT DE RESGATE: Sincronizar Usuários Existentes com Perfis
-- Rode isso para "puxar" os 40 usuários para a Dashboard
-- =============================================================

-- 1. Insere perfis para TODOS os usuários que estão na tabela de Auth mas não na de Profiles
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

-- 2. Atualiza emails de perfis existentes que possam estar nulos
UPDATE public.profiles p
SET email = au.email
FROM auth.users au
WHERE p.id = au.id AND p.email IS NULL;

-- 3. Confirmação (Deve mostrar um número próximo de 40 agora)
SELECT count(*) as total_usuarios_dashboard FROM public.profiles;
