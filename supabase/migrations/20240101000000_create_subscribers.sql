-- Supabase migration: create subscribers table for Stripe payment tracking
-- Run this in your Supabase SQL editor or via the Supabase CLI.

create table if not exists public.subscribers (
  id                  uuid primary key default gen_random_uuid(),
  email               text not null,
  app                 text not null,           -- 'carer-hire-ai' | 'little-ones-ai'
  plan                text not null,           -- plan ID (e.g. 'daily_companion')
  status              text not null default 'inactive', -- 'active' | 'inactive' | 'cancelled'
  stripe_customer_id  text,
  stripe_data         jsonb,                   -- raw Stripe event metadata
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  -- one subscriber row per email per app
  constraint subscribers_email_app_key unique (email, app)
);

-- Row Level Security: only the service role (used by webhook) can write;
-- authenticated users can read their own row.
alter table public.subscribers enable row level security;

create policy "Service role full access"
  on public.subscribers
  as permissive
  for all
  to service_role
  using (true)
  with check (true);

create policy "Users can read own subscription"
  on public.subscribers
  as permissive
  for select
  to authenticated
  using (email = auth.jwt() ->> 'email');

-- Index for fast lookups by email + app
create index if not exists subscribers_email_app_idx
  on public.subscribers (email, app);
