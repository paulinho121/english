-- Fix data consistency: Ensure classrooms are linked to organizations
UPDATE classrooms c
SET organization_id = p.organization_id
FROM profiles p
WHERE c.teacher_id = p.id
AND c.organization_id IS NULL;

-- Log the number of updated records? (psql output will show row count)
-- Just checking if classrooms now have organization_id
-- If teacher has no org, classroom remains with NULL org and is visible ONLY to teacher (via teacher policy)

-- Add explicit RLS policy for Admins to SEE ALL classrooms, even if org_id is NULL? 
-- No, that leaks data. Admins only see THEIR org.
-- If classroom has no org, Admin cannot see it.
-- We must fix the data.
