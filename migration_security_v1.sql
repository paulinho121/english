-- migration_security_v1.sql
-- Goal: Protect critical columns from unauthorized client-side updates.

-- 1. Restrict Update on sensitive columns
-- Note: Supabase doesn't support column-level RLS directly for updates in a simple way 
-- without splitting tables, but we can use a CHECK or a BEFORE UPDATE trigger.

-- Preferred Way: Trigger to prevent manual manipulation of is_premium/daily_minutes_used
CREATE OR REPLACE FUNCTION protect_profile_columns()
RETURNS TRIGGER AS $$
BEGIN
  -- If the user is NOT a service_role (e.g., they are a regular authenticated user)
  -- We prevent them from changing is_premium or daily_minutes_used manually.
  
  -- Check if is_premium is being changed
  IF (OLD.is_premium IS DISTINCT FROM NEW.is_premium) AND (current_setting('role') = 'authenticated') THEN
    -- Only allow the update if it's NOT changing is_premium, 
    -- OR we can just force it back to OLD value.
    NEW.is_premium := OLD.is_premium;
  END IF;

  -- Check if daily_minutes_used is being changed
  IF (OLD.daily_minutes_used IS DISTINCT FROM NEW.daily_minutes_used) AND (current_setting('role') = 'authenticated') THEN
     -- Now that we have the RPC, we block direct updates.
     NEW.daily_minutes_used := OLD.daily_minutes_used; 
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_protect_profile_columns ON profiles;
CREATE TRIGGER tr_protect_profile_columns
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION protect_profile_columns();

-- 2. Create a secure RPC for usage sync (Advanced)
-- This allows the client to call 'sync_usage' without having direct UPDATE permission on the whole row.
CREATE OR REPLACE FUNCTION sync_user_usage(p_minutes FLOAT)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET daily_minutes_used = daily_minutes_used + p_minutes,
      last_seen = now()
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
