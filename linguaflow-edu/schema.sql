-- Database Schema for LinguaflowEdu (Public Version for Compatibility)
-- Using public schema with edu_ prefix to avoid 406 Not Acceptable errors in some Supabase configurations.

-- 1. Schools Table
CREATE TABLE IF NOT EXISTS public.edu_schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    contact_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Teachers Table
CREATE TABLE IF NOT EXISTS public.edu_teachers (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES public.edu_schools(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    bio TEXT,
    specialties TEXT[],
    avatar_url TEXT,
    rating DECIMAL(3, 2) DEFAULT 5.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Classes Table (Linked to schools)
CREATE TABLE IF NOT EXISTS public.edu_classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES public.edu_teachers(id) ON DELETE CASCADE,
    school_id UUID REFERENCES public.edu_schools(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    max_students INTEGER DEFAULT 10,
    status TEXT CHECK (status IN ('draft', 'active', 'archived')) DEFAULT 'draft',
    access_token UUID DEFAULT gen_random_uuid(), -- Link único da sala
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enrollments Table
CREATE TABLE IF NOT EXISTS public.edu_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.edu_classes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('enrolled', 'dropped', 'completed')) DEFAULT 'enrolled',
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, student_id)
);

-- 5. Sessions Table (Class Content + Homework Misson)
CREATE TABLE IF NOT EXISTS public.edu_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.edu_classes(id) ON DELETE CASCADE,
    content_summary TEXT, -- What was taught in class
    homework_topic TEXT,   -- Conversation topic for student's AI
    homework_focus TEXT,   -- Grammar/Vocab focus for student's AI
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. AI Practice Logs (Results from student's practice at home)
CREATE TABLE IF NOT EXISTS public.edu_ai_practice_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.edu_sessions(id) ON DELETE CASCADE,
    duration_minutes INTEGER DEFAULT 0,
    fluency_score DECIMAL(3,2),
    vocabulary_notes TEXT, -- Words/expressions student struggled with
    common_mistakes TEXT[], -- Specific errors noted by AI
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.edu_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edu_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edu_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edu_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edu_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edu_ai_practice_logs ENABLE ROW LEVEL SECURITY;

-- Policies (Simplified for development)
DROP POLICY IF EXISTS "permit_all_schools" ON public.edu_schools;
CREATE POLICY "permit_all_schools" ON public.edu_schools FOR ALL USING (true);
DROP POLICY IF EXISTS "permit_all_teachers" ON public.edu_teachers;
CREATE POLICY "permit_all_teachers" ON public.edu_teachers FOR ALL USING (true);
DROP POLICY IF EXISTS "permit_all_classes" ON public.edu_classes;
CREATE POLICY "permit_all_classes" ON public.edu_classes FOR ALL USING (true);
DROP POLICY IF EXISTS "permit_all_enrollments" ON public.edu_enrollments;
CREATE POLICY "permit_all_enrollments" ON public.edu_enrollments FOR ALL USING (true);
DROP POLICY IF EXISTS "permit_all_sessions" ON public.edu_sessions;
CREATE POLICY "permit_all_sessions" ON public.edu_sessions FOR ALL USING (true);
DROP POLICY IF EXISTS "permit_all_logs" ON public.edu_ai_practice_logs;
CREATE POLICY "permit_all_logs" ON public.edu_ai_practice_logs FOR ALL USING (true);

-- 7. Invitations Table (For personalized practice links)
CREATE TABLE IF NOT EXISTS public.edu_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token UUID DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.edu_classes(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days',
    used_at TIMESTAMPTZ
);

ALTER TABLE public.edu_invitations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "permit_all_invitations" ON public.edu_invitations;
CREATE POLICY "permit_all_invitations" ON public.edu_invitations FOR ALL USING (true);

-- Automation: Create teacher profile
CREATE OR REPLACE FUNCTION public.handle_new_edu_teacher()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.edu_teachers (id, full_name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', 'Professor'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_edu_v2 ON auth.users;
CREATE TRIGGER on_auth_user_created_edu_v2
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_edu_teacher();
