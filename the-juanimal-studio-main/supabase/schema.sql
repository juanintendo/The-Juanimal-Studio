-- Run this once in the Supabase SQL editor for your project.

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text default 'ux-audit',
  created_at timestamptz default now()
);

create table if not exists audits (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete cascade,
  url text not null,
  screenshot_url text,
  report jsonb not null,
  created_at timestamptz default now()
);

create index if not exists audits_lead_id_idx on audits(lead_id);
create index if not exists leads_email_idx on leads(email);
