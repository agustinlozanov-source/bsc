-- ============================================================================
-- BSC · Migración 0002 — PROFESIONALES
-- ============================================================================

create table public.professional_profile (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profile(id) on delete cascade,
  tenant_id uuid references public.tenant(id),
  specialties text[],
  academic_degrees jsonb,
  professional_experience jsonb,
  institutional_email text,
  admission_date date,
  contract_expiry date,
  membership_tier text check (membership_tier in ('standard', 'premium')),
  is_master_consultant boolean default false,
  master_consultant_date date,
  master_progress_pct numeric(5,2) default 0,
  performance_score numeric(3,2),
  qr_code_url text,
  public_profile_slug text unique,
  nda_signed boolean default false,
  image_rights_signed boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.professional_tenant (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid references public.professional_profile(id) on delete cascade,
  tenant_id uuid references public.tenant(id) on delete cascade,
  membership_tier text,
  is_active boolean default true,
  joined_at timestamptz default now(),
  unique (professional_id, tenant_id)
);

create trigger trg_professional_profile_updated
  before update on public.professional_profile
  for each row execute function public.set_updated_at();

-- Helper: id del perfil profesional del usuario actual
create or replace function public.current_professional_id()
returns uuid
language sql stable security definer set search_path = public
as $$
  select id from public.professional_profile
  where user_id = auth.uid() limit 1;
$$;

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.professional_profile enable row level security;
alter table public.professional_tenant  enable row level security;

create policy professional_profile_select on public.professional_profile
  for select to authenticated
  using (user_id = auth.uid() or public.has_tenant_access(tenant_id));

create policy professional_profile_insert on public.professional_profile
  for insert to authenticated
  with check (user_id = auth.uid() or public.is_admin_of(tenant_id));

create policy professional_profile_update on public.professional_profile
  for update to authenticated
  using (user_id = auth.uid() or public.is_admin_of(tenant_id))
  with check (user_id = auth.uid() or public.is_admin_of(tenant_id));

create policy professional_tenant_select on public.professional_tenant
  for select to authenticated
  using (
    public.has_tenant_access(tenant_id)
    or professional_id = public.current_professional_id()
  );

create policy professional_tenant_write on public.professional_tenant
  for all to authenticated
  using (public.is_admin_of(tenant_id))
  with check (public.is_admin_of(tenant_id));
