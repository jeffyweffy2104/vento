create extension if not exists pgcrypto;
create table if not exists public.waitlist (id uuid primary key default gen_random_uuid(), email text unique not null, phone text, sms_consent boolean default false, referral_code text unique not null, referred_by uuid references public.waitlist(id), created_at timestamptz default now());
create table if not exists public.email_deliveries (id uuid primary key default gen_random_uuid(), subscriber_id uuid references public.waitlist(id), status text not null, provider_message_id text, created_at timestamptz default now());
alter table public.waitlist enable row level security;
alter table public.email_deliveries enable row level security;
