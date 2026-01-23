-- migration_fix_admin_premium_v2.sql
-- Goal: Permitir que o Super Admin altere o status Premium dos usuários no Dashboard.

-- 1. Garantir que a função is_super_admin exista e esteja correta
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

-- 2. Atualizar a função protect_profile_columns para permitir admin bypass
CREATE OR REPLACE FUNCTION protect_profile_columns()
RETURNS TRIGGER AS $$
BEGIN
  -- Se for Super Admin, permitir qualquer alteração (Bypass do bloqueio)
  IF is_super_admin() THEN
    RETURN NEW;
  END IF;

  -- Se for um usuário comum (authenticated), bloquear alteração de is_premium
  IF (OLD.is_premium IS DISTINCT FROM NEW.is_premium) AND (current_setting('role', true) = 'authenticated') THEN
    NEW.is_premium := OLD.is_premium;
  END IF;

  -- Se for um usuário comum (authenticated), bloquear alteração de daily_minutes_used
  IF (OLD.daily_minutes_used IS DISTINCT FROM NEW.daily_minutes_used) AND (current_setting('role', true) = 'authenticated') THEN
     NEW.daily_minutes_used := OLD.daily_minutes_used; 
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Garantir que o gatilho está ativo
DROP TRIGGER IF EXISTS tr_protect_profile_columns ON profiles;
CREATE TRIGGER tr_protect_profile_columns
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION protect_profile_columns();

-- 4. Garantir políticas de RLS para o Admin
DROP POLICY IF EXISTS "Admin manage all profiles" ON profiles;
CREATE POLICY "Admin manage all profiles" ON profiles
    FOR ALL
    TO authenticated
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

-- 5. Dar permissão explicita para a role authenticated
GRANT UPDATE ON profiles TO authenticated;
