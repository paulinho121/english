-- migration_system_admin_v1.sql
-- Goal: Decouple admin access from hardcoded email and use a database flag.

-- 1. Add is_system_admin column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_system_admin BOOLEAN DEFAULT FALSE;

-- 2. Set the initial admin
UPDATE public.profiles 
SET is_system_admin = TRUE 
WHERE email = 'paulofernandoautomacao@gmail.com';

-- 3. Update is_super_admin function to check the database flag
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() 
    AND is_system_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql;

-- 4. Ensure RLS policies are up to date (they should already use is_super_admin())
-- No changes needed to policies if they use the function correctly.

-- 5. Add index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_system_admin ON public.profiles(is_system_admin) WHERE is_system_admin = TRUE;
