-- ═════════════════════════════════════════════════════════════════════════
-- HRP — Notices table setup
-- Run this in Supabase Dashboard → SQL Editor.
-- Powers the homepage popup that the admin can edit at /admin/dashboard/notice
-- ═════════════════════════════════════════════════════════════════════════

create table if not exists public.notices (
  id           bigserial primary key,
  title        text not null,
  message      text not null,
  type         text not null default 'info',   -- 'info' | 'sale' | 'closure' | 'urgent'
  cta_label    text,
  cta_link     text,
  is_active    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Keep updated_at fresh on every UPDATE
create or replace function public.notices_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists notices_updated_at on public.notices;
create trigger notices_updated_at
  before update on public.notices
  for each row execute function public.notices_set_updated_at();

-- Index so the "active notice" query is fast
create index if not exists notices_active_idx
  on public.notices (is_active, updated_at desc);

-- ── RLS ────────────────────────────────────────────────────────────────────
alter table public.notices enable row level security;

drop policy if exists "notices public read active"   on public.notices;
drop policy if exists "notices authed all"           on public.notices;

-- Anyone can READ the currently-active notice (so the popup can render)
create policy "notices public read active"
on public.notices for select
to public
using (is_active = true);

-- Signed-in admins can do anything
create policy "notices authed all"
on public.notices for all
to authenticated
using (true)
with check (true);
