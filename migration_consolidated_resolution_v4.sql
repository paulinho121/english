-- RESOLUTION V4: The Definitive Fix for B2B Permissions & Admin Access
-- Combined logic from v2, v3, and rls_final to ensure stability.

-- 1. Create a robust function to check for Super Admin status via auth.users
-- This bypasses potential RLS recursion issues or missing JWT claims.
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN
SECURITY DEFINER -- Runs as the superuser/creator
SET search_path = public, auth
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE id = auth.uid() 
    AND email = 'paulofernandoautomacao@gmail.com' -- Hardcoded Super Admin
  );
END;
$$ LANGUAGE plpgsql;

-- 2. Clear out ALL conflicting/old policies to ensure a clean slate
DROP POLICY IF EXISTS "Super Admin sees all" ON profiles;
DROP POLICY IF EXISTS "Super Admin updates all" ON profiles;
DROP POLICY IF EXISTS "Admin Email Access" ON profiles;
DROP POLICY IF EXISTS "Dashboard Policy" ON profiles;
DROP POLICY IF EXISTS "User Own Access" ON profiles;
DROP POLICY IF EXISTS "Org Admins can view their members" ON profiles;
DROP POLICY IF EXISTS "Super Admin Access" ON profiles; -- Drop self if exists from previous run

-- 3. Apply the "Master Key" Policy for Super Admin (Select & Update)
-- This policy allows Paulo to do EVERYTHING, and regular users to see/edit THEMSELVES.
CREATE POLICY "Super Admin Access" ON profiles
    FOR ALL -- covers SELECT, INSERT, UPDATE, DELETE
    TO authenticated
    USING (
        is_super_admin() -- You are Paulo
        OR 
        auth.uid() = id -- Or you are accessing your own profile
    );

-- 4. Ensure the Super Admin User actually has the 'admin' role in the profiles table
-- We look up the UUID from auth.users to avoid "column email does not exist" errors in profiles.
UPDATE profiles 
SET org_role = 'admin'
WHERE id = (
    SELECT id 
    FROM auth.users 
    WHERE email = 'paulofernandoautomacao@gmail.com'
    LIMIT 1
);

-- 5. (Optional but recommended) Ensure missing profiles are created
-- This fixes the "Empty Dashboard" issue if the profile row doesn't exist yet.
-- We purposely OMIT the 'email' column here to avoid errors if that column was removed from profiles.
INSERT INTO public.profiles (id, full_name, last_seen)
SELECT 
    id,
    COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', 'Unknown User'),
    COALESCE(last_sign_in_at, created_at)
FROM auth.users
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.users.id);
