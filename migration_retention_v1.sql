-- Migração para suporte a Ofensiva (Streak) e Meta Diária
-- Adiciona rastreamento de data para permitir resets diários e incrementos de streak

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_streak_at DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS daily_minutes_used INTEGER DEFAULT 0;

-- Nota: streak_count e daily_minutes_used já podem existir, mas garantimos aqui.
