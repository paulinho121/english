-- Adiciona colunas se elas não existirem (Safe Migration)
alter table profiles add column if not exists full_name text;
alter table profiles add column if not exists phone_number text;
alter table profiles add column if not exists current_session_id text;
alter table profiles add column if not exists last_seen timestamp with time zone;

-- Garante que RLS está ativo
alter table profiles enable row level security;

-- Remove políticas antigas (se existirem) para evitar erros de duplicidade
drop policy if exists "Users can view own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Users can insert own profile" on profiles;

-- Recria as políticas de segurança
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
