-- Migration to enable B2B Features (Organizations & Multi-tenancy)

-- 1. Create Organizations Table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('team', 'business', 'enterprise')),
    max_seats INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add Organization Link to Profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id),
ADD COLUMN IF NOT EXISTS org_role TEXT DEFAULT 'member' CHECK (org_role IN ('admin', 'member'));

-- 3. Enable RLS on Organizations
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- Policy: Members can view their own organization
DROP POLICY IF EXISTS "Members can view their own organization" ON organizations;
CREATE POLICY "Members can view their own organization" ON organizations
    FOR SELECT USING (
        id IN (
            SELECT organization_id FROM profiles WHERE id = auth.uid()
        )
    );

-- 5. Admin View Policy for Profiles (Managers viewing their employees)
-- Note: Existing policies are usually inclusive (OR). We add this to allow Org Admins to see their team.

DROP POLICY IF EXISTS "Org Admins can view their members" ON profiles;
CREATE POLICY "Org Admins can view their members" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles viewer
            WHERE viewer.id = auth.uid()
            AND viewer.org_role = 'admin'
            AND viewer.organization_id = profiles.organization_id
            AND viewer.organization_id IS NOT NULL
        )
    );
