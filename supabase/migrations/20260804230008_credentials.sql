-- ============================================================================
-- BSC · Migración 0008 — CREDENCIALES / INSIGNIAS
-- Nota: la verificación PÚBLICA (anon) se habilita en la Fase 8 vía RPC/vista
-- SECURITY DEFINER, para exponer solo los campos verificables. Aquí el acceso
-- queda restringido a dueño + admin del tenant.
-- ============================================================================

create table public.badge_template (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenant(id),   -- null = global BSC
  name text not null,
  description text,
  image_url text not null,
  criteria text not null,
  skills uuid[],
  hours_required numeric(6,1),
  level text,
  is_auto_issue boolean default true,
  auto_issue_rules jsonb,
  ob3_metadata jsonb,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table public.credential_issued (
  id uuid primary key default gen_random_uuid(),
  credential_id text unique not null,            -- "BSC-2026-00142"
  badge_template_id uuid references public.badge_template(id),
  user_id uuid references public.user_profile(id),
  tenant_id uuid references public.tenant(id),
  program_schedule_id uuid references public.program_schedule(id),
  issued_at timestamptz default now(),
  expires_at timestamptz,
  verification_url text not null,
  linkedin_add_url text,
  ob3_json jsonb,
  is_revoked boolean default false,
  revoked_reason text,
  verification_count integer default 0,
  last_verified_at timestamptz,
  created_at timestamptz default now()
);

create table public.credential_verification_log (
  id uuid primary key default gen_random_uuid(),
  credential_id uuid references public.credential_issued(id),
  verified_at timestamptz default now(),
  ip_address text,
  user_agent text,
  referrer text
);

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.badge_template              enable row level security;
alter table public.credential_issued           enable row level security;
alter table public.credential_verification_log enable row level security;

-- badge_template: globales visibles para todos; por tenant, quien tiene acceso.
create policy badge_template_select on public.badge_template
  for select to authenticated
  using (tenant_id is null or public.has_tenant_access(tenant_id));
create policy badge_template_write on public.badge_template
  for all to authenticated
  using ((tenant_id is null and public.is_superadmin()) or public.is_admin_of(tenant_id))
  with check ((tenant_id is null and public.is_superadmin()) or public.is_admin_of(tenant_id));

-- credential_issued: el titular y el admin del tenant.
create policy credential_issued_select on public.credential_issued
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin_of(tenant_id));
create policy credential_issued_write on public.credential_issued
  for all to authenticated
  using (public.is_admin_of(tenant_id))
  with check (public.is_admin_of(tenant_id));

-- credential_verification_log: solo admin del tenant de la credencial lo consulta.
create policy credential_verification_log_select on public.credential_verification_log
  for select to authenticated
  using (exists (select 1 from public.credential_issued c
                 where c.id = credential_verification_log.credential_id
                   and public.is_admin_of(c.tenant_id)));
