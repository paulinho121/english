-- Migration to add Kids Mode and session details to database

-- Ensure profiles has all necessary columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS daily_minutes_used INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_kids_mode BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_language TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_level TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_teacher_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_topic_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0;

-- Create user_progress table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  status TEXT CHECK (status IN ('locked', 'unlocked', 'completed')) DEFAULT 'locked',
  score INTEGER DEFAULT 0,
  last_played_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- Add JSONB columns to user_progress to store detailed session results
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS mistakes JSONB DEFAULT '[]';
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS vocabulary JSONB DEFAULT '[]';
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS tip TEXT;

-- Enable RLS and add policies just in case
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
CREATE POLICY "Users can update own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can modify own progress" ON user_progress;
CREATE POLICY "Users can modify own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);
