-- FIX: Restore visibility for Super Admin (Paulo) and ensure RLS doesn't block him
-- Also ensures he can manage organizations

-- 1. Ensure Super Admin can SEE everything (Fixing "Disappearing Students")
DROP POLICY IF EXISTS "Super Admin sees all" ON profiles;
CREATE POLICY "Super Admin sees all" ON profiles
    FOR SELECT TO authenticated
    USING (
        auth.jwt() ->> 'email' = 'paulofernandoautomacao@gmail.com'
    );

-- 2. Ensure Super Admin can UDPATE everything
DROP POLICY IF EXISTS "Super Admin updates all" ON profiles;
CREATE POLICY "Super Admin updates all" ON profiles
    FOR UPDATE TO authenticated
    USING (
        auth.jwt() ->> 'email' = 'paulofernandoautomacao@gmail.com'
    );

-- 3. Grant Admin privileges to Paulo on his own profile (so he can test B2B features as a user)
-- This tries to update his profile to have 'admin' role if he belongs to any org.
-- If he doesn't belong to any org, he might need to create one.
UPDATE profiles 
SET org_role = 'admin'
WHERE email = 'paulofernandoautomacao@gmail.com';
