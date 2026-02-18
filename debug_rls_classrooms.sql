-- EMERGENCY: Permitir tudo na tabela classrooms para debugar
-- Se isso funcionar, o problema era a restrição teacher_id = auth.uid()
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Teachers manage own classrooms" ON classrooms;
DROP POLICY IF EXISTS "Teachers view their classrooms" ON classrooms;
DROP POLICY IF EXISTS "Org Admins can manage classrooms" ON classrooms;

-- Create a permissive policy for ALL authenticated users
CREATE POLICY "Allow All Authenticated" ON classrooms
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
