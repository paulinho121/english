-- Create SECURITY DEFINER function to verify teacher ownership
-- This function reads 'classrooms' table with owner privileges, bypassing RLS recursion
CREATE OR REPLACE FUNCTION check_is_teacher_of_classroom(cls_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM classrooms
        WHERE id = cls_id
        AND teacher_id = auth.uid()
    );
$$;

-- Update RLS policy on classroom_members to use the function
ALTER TABLE classroom_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Teachers view class members" ON classroom_members;

CREATE POLICY "Teachers view class members" ON classroom_members
    FOR SELECT
    USING (
        check_is_teacher_of_classroom(classroom_id)
    );
