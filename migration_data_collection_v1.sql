-- Migration: Data Collection V1
-- Description: Creates survey_responses table and ensures sessions table has correct columns

-- 1. Create survey_responses table
create table if not exists public.survey_responses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  survey_type text not null, -- e.g. 'pmf'
  response text, -- e.g. 'very_disappointed'
  feedback text, -- Open text input
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for survey_responses
alter table public.survey_responses enable row level security;

-- Policy: Users can insert their own responses
create policy "Users can insert their own survey responses"
  on public.survey_responses for insert
  with check (auth.uid() = user_id);

-- Policy: Users can view their own responses (optional, but good for debugging)
create policy "Users can view their own survey responses"
  on public.survey_responses for select
  using (auth.uid() = user_id);


-- 2. Update sessions table (Adding missing columns based on inspection)
-- Existing columns based on screenshot: id, user_id, teacher_id, language
-- We need: topic_id, start_time, end_time, duration_seconds, status

do $$ 
begin
  if not exists (select 1 from information_schema.columns where table_name = 'sessions' and column_name = 'topic_id') then
    alter table public.sessions add column topic_id text;
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'sessions' and column_name = 'start_time') then
    alter table public.sessions add column start_time timestamp with time zone default timezone('utc'::text, now());
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'sessions' and column_name = 'end_time') then
    alter table public.sessions add column end_time timestamp with time zone;
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'sessions' and column_name = 'duration_seconds') then
    alter table public.sessions add column duration_seconds integer;
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'sessions' and column_name = 'status') then
    alter table public.sessions add column status text default 'completed';
  end if;
end $$;

-- Ensure RLS is enabled for sessions and policies exist
alter table public.sessions enable row level security;

-- Drop existing policies to avoid conflicts if they are restrictive, or create if not exists
drop policy if exists "Users can insert their own sessions" on public.sessions;
create policy "Users can insert their own sessions"
  on public.sessions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own sessions" on public.sessions;
create policy "Users can update their own sessions"
  on public.sessions for update
  using (auth.uid() = user_id);

drop policy if exists "Users can view their own sessions" on public.sessions;
create policy "Users can view their own sessions"
  on public.sessions for select
  using (auth.uid() = user_id);
