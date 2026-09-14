-- Calendly → Admin "Meetings" pipeline
-- Bookings land here from the calendly-webhook edge function (service role,
-- bypasses RLS). No anon-insert policy on purpose: the browser never writes
-- this table directly, the webhook is the single source of truth.
-- Idempotent: invitee_uri is unique, so Calendly webhook retries are no-ops.

create table if not exists public.meetings (
  id uuid primary key default gen_random_uuid(),
  invitee_uri text unique not null,
  event_uri text default '',
  event_type text default '',
  invitee_name text not null default '',
  invitee_email text not null default '',
  start_time timestamptz,
  timezone text default '',
  status text not null default 'scheduled' check (status in ('scheduled','rescheduled','canceled')),
  question_answers jsonb default '[]'::jsonb,
  raw jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists meetings_start_time_idx on public.meetings (start_time desc);

alter table public.meetings enable row level security;

-- Same access model as leads: every signed-in staff member reads and manages,
-- only admins delete.
create policy "staff read meetings" on public.meetings
  for select using (public.my_role() is not null);
create policy "staff manage meetings" on public.meetings
  for update using (public.my_role() is not null);
create policy "admin delete meetings" on public.meetings
  for delete using (public.my_role() = 'admin');
