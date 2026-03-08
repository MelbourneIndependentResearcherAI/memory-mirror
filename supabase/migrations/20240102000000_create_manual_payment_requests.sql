-- Supabase migration: create manual_payment_requests table
-- Tracks bank-transfer / PayID payment submissions that require manual activation.
-- Run this in your Supabase SQL editor or via the Supabase CLI.

create table if not exists public.manual_payment_requests (
  id          uuid primary key default gen_random_uuid(),
  app         text not null,           -- 'carer-hire-ai' | 'little-ones-ai'
  plan_id     text not null,           -- plan identifier (e.g. 'daily_companion')
  plan_name   text,                    -- human-readable plan name
  amount      numeric(10, 2),          -- AUD amount
  name        text not null,           -- subscriber's full name
  email       text not null,           -- subscriber's email
  reference   text not null unique,    -- unique reference code (e.g. CHA-DAILY_COMPANION-ABC123)
  status      text not null default 'pending', -- 'pending' | 'confirmed' | 'rejected'
  notes       text,                    -- admin notes
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Row Level Security
alter table public.manual_payment_requests enable row level security;

create policy "Service role full access"
  on public.manual_payment_requests
  as permissive
  for all
  to service_role
  using (true)
  with check (true);

create policy "Users can read own manual payment requests"
  on public.manual_payment_requests
  as permissive
  for select
  to authenticated
  using (email = auth.jwt() ->> 'email');

-- Indexes
create index if not exists manual_payment_requests_email_idx
  on public.manual_payment_requests (email);

create index if not exists manual_payment_requests_reference_idx
  on public.manual_payment_requests (reference);

create index if not exists manual_payment_requests_status_idx
  on public.manual_payment_requests (status);
