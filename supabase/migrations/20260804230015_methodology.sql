-- ============================================================================
-- BSC · Migración 0015 — METODOLOGÍA BSC
-- ============================================================================

create table public.methodology_diagnostic (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenant(id),   -- null = diagnóstico global (online)
  scope text check (scope in ('local', 'global')),
  period text,
  industries jsonb,
  investments jsonb,
  legislation jsonb,
  trends jsonb,
  problems jsonb,
  opportunities jsonb,
  notes text,
  created_by uuid references public.user_profile(id),
  created_at timestamptz default now()
);

create table public.methodology_topic_validation (
  id uuid primary key default gen_random_uuid(),
  diagnostic_id uuid references public.methodology_diagnostic(id),
  topic text not null,
  impact_type text check (impact_type in ('economic', 'transcendence', 'both')),
  impact_justification text,
  target_audience text,
  recommended_format public.format_type,
  recommended_modality public.modality_type,
  status text check (status in ('proposed', 'validated', 'rejected', 'active', 'retired')),
  performance_data jsonb,
  validated_by uuid references public.user_profile(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger trg_methodology_topic_validation_updated
  before update on public.methodology_topic_validation
  for each row execute function public.set_updated_at();

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.methodology_diagnostic       enable row level security;
alter table public.methodology_topic_validation enable row level security;

-- Herramienta de admin/superadmin. Global = superadmin; por tenant = su admin/socio (lectura).
create policy methodology_diagnostic_select on public.methodology_diagnostic
  for select to authenticated
  using ((tenant_id is null and public.is_superadmin()) or public.is_tenant_admin(tenant_id));
create policy methodology_diagnostic_write on public.methodology_diagnostic
  for all to authenticated
  using ((tenant_id is null and public.is_superadmin()) or public.is_admin_of(tenant_id))
  with check ((tenant_id is null and public.is_superadmin()) or public.is_admin_of(tenant_id));

-- topic_validation: sigue el acceso del diagnóstico padre.
create policy methodology_topic_validation_select on public.methodology_topic_validation
  for select to authenticated
  using (exists (select 1 from public.methodology_diagnostic d
                 where d.id = diagnostic_id
                   and ((d.tenant_id is null and public.is_superadmin())
                        or public.is_tenant_admin(d.tenant_id))));
create policy methodology_topic_validation_write on public.methodology_topic_validation
  for all to authenticated
  using (exists (select 1 from public.methodology_diagnostic d
                 where d.id = diagnostic_id
                   and ((d.tenant_id is null and public.is_superadmin())
                        or public.is_admin_of(d.tenant_id))))
  with check (exists (select 1 from public.methodology_diagnostic d
                 where d.id = diagnostic_id
                   and ((d.tenant_id is null and public.is_superadmin())
                        or public.is_admin_of(d.tenant_id))));
