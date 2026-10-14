create extension if not exists pgcrypto;

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null check (char_length(email) <= 254),
  phone text check (phone is null or char_length(phone) <= 32),
  email_verified_at timestamptz,
  sms_consent boolean not null default false,
  sms_consent_at timestamptz,
  consent_version text not null default '2026-10-13',
  referral_code text unique not null check (referral_code ~ '^[a-f0-9]{16}$'),
  referred_by uuid references public.waitlist(id) on delete set null,
  source text,
  campaign text,
  medium text,
  content text,
  city text,
  status text not null default 'pending' check (status in ('pending','verified','unsubscribed','deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (referred_by is null or referred_by <> id),
  check (sms_consent = false or phone is not null)
);

create index if not exists waitlist_created_at_idx on public.waitlist(created_at desc);
create index if not exists waitlist_referred_by_idx on public.waitlist(referred_by);
create index if not exists waitlist_campaign_idx on public.waitlist(campaign) where campaign is not null;

create table if not exists public.email_verifications (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid not null references public.waitlist(id) on delete cascade,
  token_hash text unique not null,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists email_verifications_subscriber_idx on public.email_verifications(subscriber_id, created_at desc);

create table if not exists public.email_deliveries (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid not null references public.waitlist(id) on delete cascade,
  template text not null,
  idempotency_key text unique not null,
  status text not null check (status in ('queued','sent','delivered','bounced','complained','failed')),
  provider_message_id text unique,
  attempt_count integer not null default 0 check (attempt_count >= 0 and attempt_count <= 5),
  last_error text,
  next_attempt_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists email_deliveries_status_idx on public.email_deliveries(status, next_attempt_at);

create table if not exists public.waitlist_attempts (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  email_hash text not null,
  accepted boolean not null,
  created_at timestamptz not null default now()
);
create index if not exists waitlist_attempts_ip_created_idx on public.waitlist_attempts(ip_hash, created_at desc);
create index if not exists waitlist_attempts_email_created_idx on public.waitlist_attempts(email_hash, created_at desc);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','analyst')),
  created_at timestamptz not null default now()
);

create table if not exists public.audit_events (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists waitlist_set_updated_at on public.waitlist;
create trigger waitlist_set_updated_at before update on public.waitlist for each row execute function public.set_updated_at();
drop trigger if exists email_deliveries_set_updated_at on public.email_deliveries;
create trigger email_deliveries_set_updated_at before update on public.email_deliveries for each row execute function public.set_updated_at();

alter table public.waitlist enable row level security;
alter table public.email_verifications enable row level security;
alter table public.email_deliveries enable row level security;
alter table public.waitlist_attempts enable row level security;
alter table public.admin_users enable row level security;
alter table public.audit_events enable row level security;

revoke all on public.waitlist, public.email_verifications, public.email_deliveries, public.waitlist_attempts, public.admin_users, public.audit_events from anon, authenticated;
grant select on public.admin_users to authenticated;

drop policy if exists "admins may read own role" on public.admin_users;
create policy "admins may read own role" on public.admin_users for select to authenticated using (user_id = auth.uid());
