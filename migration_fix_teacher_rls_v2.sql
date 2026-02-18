-- Fix RLS permissions to ensure teachers can create classrooms
-- Drop old policies to avoid conflicts
DROP POLICY IF EXISTS "Teachers view their classrooms" ON classrooms;
DROP POLICY IF EXISTS "Teachers manage own classrooms" ON classrooms;

-- Create policy allowing full management for own classrooms (INSERT, SELECT, UPDATE, DELETE)
CREATE POLICY "Teachers manage own classrooms" ON classrooms
    FOR ALL
    USING (teacher_id = auth.uid())
    WITH CHECK (teacher_id = auth.uid());
