-- Migration Contact V1
-- Table for user and business inquiries

CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company_name TEXT,
    message_type TEXT NOT NULL DEFAULT 'support', -- 'support' | 'business'
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' -- 'new' | 'read' | 'replied'
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Policies
-- Anyone can insert (to allow non-logged in users to contact from landing page)
CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

-- Only admins can view and update
-- Using the email-based admin check consistent with AdminDashboard.tsx logic
CREATE POLICY "Admins can view contact messages" ON public.contact_messages
    FOR SELECT USING (
        auth.jwt() ->> 'email' = 'paulofernandoautomacao@gmail.com'
    );

CREATE POLICY "Admins can update contact messages" ON public.contact_messages
    FOR UPDATE USING (
        auth.jwt() ->> 'email' = 'paulofernandoautomacao@gmail.com'
    );

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_type ON public.contact_messages(message_type);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);
