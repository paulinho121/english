-- Migration to fix and ensure coupons table and permissions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure table exists with correct schema
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    discount_percentage INTEGER DEFAULT 0,
    influencer_name TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    max_uses INTEGER DEFAULT 100,
    uses_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Allow all users to read coupons" ON coupons;
DROP POLICY IF EXISTS "Allow service role to manage coupons" ON coupons;
DROP POLICY IF EXISTS "Super Admin Manage Coupons" ON coupons;
DROP POLICY IF EXISTS "Public Read Coupons" ON coupons;

-- 1. Anyone (public) can read coupons to validate them during checkout
CREATE POLICY "Public Read Coupons" ON coupons
    FOR SELECT USING (true);

-- 2. Only Super Admin can manage (Insert, Update, Delete) coupons
CREATE POLICY "Super Admin Manage Coupons" ON coupons
    FOR ALL
    TO authenticated
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

-- Grant permissions to anon and authenticated roles
GRANT ALL ON coupons TO postgres;
GRANT ALL ON coupons TO service_role;
GRANT SELECT ON coupons TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON coupons TO authenticated;
