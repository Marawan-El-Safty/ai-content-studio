-- ─────────────────────────────────────────────────────────────
-- AI Content Studio — Supabase schema
-- Run this in the Supabase SQL editor to enable cloud persistence.
-- The app works without it (localStorage); this upgrades the
-- library to multi-device, authenticated storage.
-- ─────────────────────────────────────────────────────────────

create table if not exists public.drafts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  title         text not null,
  body          text not null,
  content_type  text not null,
  tone          text not null,
  brief         text,
  favorite      boolean not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists drafts_user_id_created_at_idx
  on public.drafts (user_id, created_at desc);

-- Row Level Security: each user only sees their own drafts.
alter table public.drafts enable row level security;

create policy "Users read own drafts"
  on public.drafts for select
  using (auth.uid() = user_id);

create policy "Users insert own drafts"
  on public.drafts for insert
  with check (auth.uid() = user_id);

create policy "Users update own drafts"
  on public.drafts for update
  using (auth.uid() = user_id);

create policy "Users delete own drafts"
  on public.drafts for delete
  using (auth.uid() = user_id);
