-- Migration for Educational Model (Classrooms & Assignments)
-- This enables schools to manage students and teachers to assign homework.

-- 1. Create Classrooms Table (Turmas)
CREATE TABLE IF NOT EXISTS classrooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    teacher_id UUID REFERENCES profiles(id), -- Professor responsavel
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Classroom Members Table (Matriculas)
CREATE TABLE IF NOT EXISTS classroom_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(classroom_id, student_id) -- Prevent duplicate enrollment
);

-- 3. Create Assignments Table (Tarefas/Licao de Casa)
CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    topic_id TEXT, -- ID do topico do app que deve ser praticado (opcional)
    pronunciation_phrases JSONB, -- Lista de frases especificas (opcional)
    due_date TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES profiles(id), -- Professor que criou
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Assignment Submissions Table (Entregas)
CREATE TABLE IF NOT EXISTS assignment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    score NUMERIC, -- Nota media obtida (0-100)
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    feedback JSONB, -- Detalhes dos erros/acertos
    UNIQUE(assignment_id, student_id) -- Uma entrega por aluno por tarefa (pode ser refeito, mas atualiza)
);

-- 5. Enable RLS on all exciting new tables
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE classroom_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;


-- 6. RLS Policies

-- CLASSROOMS
-- Org Admins can manage all classrooms in their org
CREATE POLICY "Org Admins can manage classrooms" ON classrooms
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.organization_id = classrooms.organization_id 
            AND profiles.org_role = 'admin'
        )
    );

-- Teachers can view classrooms they are assigned to
CREATE POLICY "Teachers view their classrooms" ON classrooms
    FOR SELECT USING (teacher_id = auth.uid());

-- Students can view classrooms they are members of
CREATE POLICY "Students view their classrooms" ON classrooms
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM classroom_members 
            WHERE classroom_members.classroom_id = classrooms.id 
            AND classroom_members.student_id = auth.uid()
        )
    );


-- ASSIGNMENTS
-- Teachers/Admins can manage assignments for their classrooms
CREATE POLICY "Staff manage assignments" ON assignments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM classrooms 
            WHERE classrooms.id = assignments.classroom_id 
            AND (classrooms.teacher_id = auth.uid() OR 
                EXISTS (
                    SELECT 1 FROM profiles 
                    WHERE profiles.id = auth.uid() 
                    AND profiles.organization_id = classrooms.organization_id 
                    AND profiles.org_role = 'admin'
                )
            )
        )
    );

-- Students can view assignments for their classrooms
CREATE POLICY "Students view assignments" ON assignments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM classroom_members 
            WHERE classroom_members.classroom_id = assignments.classroom_id 
            AND classroom_members.student_id = auth.uid()
        )
    );

-- SUBMISSIONS
-- Students manage their own submissions
CREATE POLICY "Students manage submissions" ON assignment_submissions
    FOR ALL USING (student_id = auth.uid());

-- Teachers view submissions for their assignments
CREATE POLICY "Teachers view submissions" ON assignment_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM assignments
            JOIN classrooms ON classrooms.id = assignments.classroom_id
            WHERE assignments.id = assignment_submissions.assignment_id
            AND (classrooms.teacher_id = auth.uid() OR 
                 EXISTS (
                    SELECT 1 FROM profiles 
                    WHERE profiles.id = auth.uid() 
                    AND profiles.organization_id = classrooms.organization_id 
                    AND profiles.org_role = 'admin'
                 )
            )
        )
    );
