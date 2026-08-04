-- ============================================================================
-- BSC · Migración 0006 — EVALUACIONES
-- ============================================================================

-- Evaluación anónima post-evento: NO tiene user_id.
create table public.post_event_evaluation (
  id uuid primary key default gen_random_uuid(),
  program_schedule_id uuid references public.program_schedule(id),
  tenant_id uuid references public.tenant(id),
  infrastructure_score integer check (infrastructure_score between 1 and 10),
  topic_relevance_score integer check (topic_relevance_score between 1 and 10),
  topic_update_score integer check (topic_update_score between 1 and 10),
  facilitator_clarity integer check (facilitator_clarity between 1 and 10),
  facilitator_mastery integer check (facilitator_mastery between 1 and 10),
  facilitator_interaction integer check (facilitator_interaction between 1 and 10),
  facilitator_preparation integer check (facilitator_preparation between 1 and 10),
  facilitator_punctuality integer check (facilitator_punctuality between 1 and 10),
  format_adequacy integer check (format_adequacy between 1 and 10),
  duration_adequacy integer check (duration_adequacy between 1 and 10),
  overall_score integer check (overall_score between 1 and 10),
  comments text,
  would_recommend boolean,
  created_at timestamptz default now()
);

create table public.skill_assessment (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profile(id),
  skill_id uuid references public.skill(id),
  assessment_type text check (assessment_type in ('self', 'test', 'psychometric', 'practical')),
  score numeric(5,2),
  level_achieved text check (level_achieved in ('basic', 'intermediate', 'advanced', 'expert')),
  assessed_at timestamptz default now(),
  notes text
);

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.post_event_evaluation enable row level security;
alter table public.skill_assessment      enable row level security;

-- post_event_evaluation: cualquiera con acceso al tenant puede enviarla (anónima);
-- solo admin del tenant lee los resultados agregados.
create policy post_event_evaluation_insert on public.post_event_evaluation
  for insert to authenticated
  with check (public.has_tenant_access(tenant_id));
create policy post_event_evaluation_select on public.post_event_evaluation
  for select to authenticated
  using (public.is_admin_of(tenant_id));

-- skill_assessment: el propio usuario y el admin de un tenant que comparte.
create policy skill_assessment_select on public.skill_assessment
  for select to authenticated
  using (user_id = auth.uid() or public.shares_tenant_with(user_id));
create policy skill_assessment_write on public.skill_assessment
  for all to authenticated
  using (user_id = auth.uid() or public.shares_tenant_with(user_id))
  with check (user_id = auth.uid() or public.shares_tenant_with(user_id));
