-- FIX V2: Restore visibility for Super Admin (Paulo)
-- Corrects the error "column email does not exist" by looking up the ID in auth.users

-- 1. Ensure Super Admin can SEE everything
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

-- 3. Grant Admin privileges to Paulo (Corrected using subquery on auth.users)
UPDATE profiles 
SET org_role = 'admin'
WHERE id = (
    SELECT id 
    FROM auth.users 
    WHERE email = 'paulofernandoautomacao@gmail.com'
    LIMIT 1
);
