-- Migration to allow Admin (paulofernandoautomacao@gmail.com) to manage all profiles

-- Current policies on profiles:
-- select: auth.uid() = id
-- update: auth.uid() = id
-- insert: auth.uid() = id

-- New Admin policy for SELECT
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
CREATE POLICY "Admin can view all profiles" ON profiles
  FOR SELECT USING (
    auth.uid() = id OR 
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'paulofernandoautomacao@gmail.com'
  );

-- New Admin policy for UPDATE
DROP POLICY IF EXISTS "Admin can update all profiles" ON profiles;
CREATE POLICY "Admin can update all profiles" ON profiles
  FOR UPDATE USING (
    auth.uid() = id OR 
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'paulofernandoautomacao@gmail.com'
  );

-- New Admin policy for checking user_progress (needed for consumption view)
DROP POLICY IF EXISTS "Admin can view all progress" ON user_progress;
CREATE POLICY "Admin can view all progress" ON user_progress
  FOR SELECT USING (
    auth.uid() = user_id OR 
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'paulofernandoautomacao@gmail.com'
  );
