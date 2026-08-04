-- ============================================================================
-- BSC · Migración 0007 — HABILIDADES ACUMULADAS
-- ============================================================================

create table public.user_skill (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profile(id),
  skill_id uuid references public.skill(id),
  current_level text check (current_level in ('basic', 'intermediate', 'advanced', 'expert')),
  total_hours numeric(8,1) default 0,
  programs_completed integer default 0,
  last_updated timestamptz default now(),
  source_enrollments uuid[],
  unique (user_id, skill_id)
);

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.user_skill enable row level security;

-- El propio usuario y quien comparte tenant (profesionales/admins) pueden verlo.
create policy user_skill_select on public.user_skill
  for select to authenticated
  using (user_id = auth.uid() or public.shares_tenant_with(user_id));
create policy user_skill_write on public.user_skill
  for all to authenticated
  using (user_id = auth.uid() or public.shares_tenant_with(user_id))
  with check (user_id = auth.uid() or public.shares_tenant_with(user_id));
