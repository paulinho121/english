-- FIX V3: The Ultimate Fix for Permissions
-- Instead of relying on JWT claims (which might be missing 'email'),
-- we create a secure function to check the email directly from auth.users.

-- 1. Create a secure function to check if the current user is the Super Admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN
SECURITY DEFINER -- Runs with privileges of the creator (postgres/supabase_admin)
SET search_path = public, auth -- Secure search path
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

-- 2. Update RLS Policy for SELECT using the new function
DROP POLICY IF EXISTS "Super Admin sees all" ON profiles;
CREATE POLICY "Super Admin sees all" ON profiles
    FOR SELECT TO authenticated
    USING (
        is_super_admin() OR 
        auth.uid() = id -- Keep standard user access
    );

-- 3. Update RLS Policy for UPDATE
DROP POLICY IF EXISTS "Super Admin updates all" ON profiles;
CREATE POLICY "Super Admin updates all" ON profiles
    FOR UPDATE TO authenticated
    USING (
        is_super_admin() OR 
        auth.uid() = id -- Keep standard user access
    );

-- 4. Also fix the "Org Admins can view their members" policy if needed
-- (This ensures that if you are an org admin, you see your members, but Super Admin sees EVERYONE)
DROP POLICY IF EXISTS "Org Admins can view their members" ON profiles;
CREATE POLICY "Org Admins can view their members" ON profiles
    FOR SELECT USING (
        -- Option 1: You are Super Admin (sees everyone)
        is_super_admin() 
        OR 
        -- Option 2: You are an Org Admin viewing a member of your org
        EXISTS (
            SELECT 1 FROM profiles viewer
            WHERE viewer.id = auth.uid()
            AND viewer.org_role = 'admin'
            AND viewer.organization_id = profiles.organization_id
            AND viewer.organization_id IS NOT NULL
        )
        OR
        -- Option 3: You are viewing yourself
        auth.uid() = id
    );

-- 5. Re-run the update to ensure your profile has admin role (just in case)
UPDATE profiles 
SET org_role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'paulofernandoautomacao@gmail.com');
