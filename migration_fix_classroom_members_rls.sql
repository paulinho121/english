-- Fix RLS for classroom_members
-- Allow students to view their own membership records
ALTER TABLE classroom_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students view own membership" ON classroom_members;

CREATE POLICY "Students view own membership" ON classroom_members
    FOR SELECT
    USING (student_id = auth.uid());
    
-- Allow teachers to view members of classrooms they teach
DROP POLICY IF EXISTS "Teachers view class members" ON classroom_members;

CREATE POLICY "Teachers view class members" ON classroom_members
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM classrooms
            WHERE classrooms.id = classroom_members.classroom_id
            AND classrooms.teacher_id = auth.uid()
        )
    );
