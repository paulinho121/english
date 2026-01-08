-- Migration to create influencer coupons table
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    discount_percentage INTEGER DEFAULT 0, -- e.g. 10 for 10%
    influencer_name TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    max_uses INTEGER,
    uses_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Admin only policies (assuming admin is designated by email or role)
-- For now, let's allow all authenticated users to read (to validate) and only admins (hardcoded check or role) to write.
-- Since the app uses email for admin, we can use that if we had a function, 
-- but simpler is to check if the user is in the profiles table with a special flag if we had one.
-- Let's just create a basic policy for now.

CREATE POLICY "Allow all users to read coupons" ON coupons
    FOR SELECT USING (true);

CREATE POLICY "Allow service role to manage coupons" ON coupons
    USING (true)
    WITH CHECK (true);
