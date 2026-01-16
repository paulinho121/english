-- Add CNPJ column to organizations table
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS cnpj TEXT;

-- Optional: Add a comment
COMMENT ON COLUMN organizations.cnpj IS 'CNPJ of the organization for B2B billing/identification';
