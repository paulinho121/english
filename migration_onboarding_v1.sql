-- Migration to track onboarding tutorial completion
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS has_completed_tutorial BOOLEAN DEFAULT FALSE;
