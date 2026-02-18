-- Diagnostic Script
-- Check existing classrooms and their owners
SELECT id, name, teacher_id, organization_id, created_at FROM classrooms;

-- Check policies
SELECT policyname, cmd, roles, qual, with_check FROM pg_policies WHERE tablename = 'classrooms';

-- Check profiles to see ID mappings (limited columns for privacy)
SELECT id, email, org_role, organization_id FROM profiles;
