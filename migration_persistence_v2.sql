-- Migration to add session persistence columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_language TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_level TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_teacher_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_topic_id TEXT;

-- Update RLS policies are already in place for profiles to allow users to update their own data.
