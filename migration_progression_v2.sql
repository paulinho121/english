-- Add Leveling columns to user_progress
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS current_level FLOAT DEFAULT 1.0;
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS total_minutes FLOAT DEFAULT 0;

-- Optional: Backfill existing rows if needed (preserving existing score as proxy?)
-- For now, we assume fresh start or compatible overlap.
