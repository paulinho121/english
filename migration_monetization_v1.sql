-- Migration to add monetization fields to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS daily_minutes_used INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_usage_reset_date DATE DEFAULT CURRENT_DATE;

-- Function to reset daily usage if a new day has started
CREATE OR REPLACE FUNCTION reset_daily_usage() 
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.last_usage_reset_date IS NULL OR NEW.last_usage_reset_date < CURRENT_DATE THEN
    NEW.daily_minutes_used = 0;
    NEW.last_usage_reset_date = CURRENT_DATE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-reset usage on any profile update
DROP TRIGGER IF EXISTS tr_reset_daily_usage ON profiles;
CREATE TRIGGER tr_reset_daily_usage
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION reset_daily_usage();
