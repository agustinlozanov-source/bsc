-- ============================================================================
-- BSC · Migración 0004 — EMPRESAS
-- ============================================================================

create table public.enterprise (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenant(id),
  name text not null,
  rfc text,
  sector text,
  size text check (size in ('micro', 'small', 'medium', 'large', 'enterprise')),
  logo_url text,
  address text,
  city text,
  state text,
  phone text,
  email text,
  website text,
  hr_contact_name text,
  hr_contact_email text,
  hr_contact_phone text,
  membership_tier text check (membership_tier in ('starter', 'business', 'enterprise')),
  membership_start_date date,
  membership_expiry_date date,
  max_collaborators integer,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.enterprise_collaborator (
  id uuid primary key default gen_random_uuid(),
  enterprise_id uuid references public.enterprise(id) on delete cascade,
  user_id uuid references public.user_profile(id),
  department text,
  position text,
  organizational_level text check (organizational_level in ('executive', 'manager', 'operational')),
  is_active boolean default true,
  added_at timestamptz default now(),
  unique (enterprise_id, user_id)
);

create trigger trg_enterprise_updated
  before update on public.enterprise
  for each row execute function public.set_updated_at();

-- Helper: ¿el usuario actual pertenece a esta empresa?
create or replace function public.is_enterprise_member(p_enterprise_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.enterprise_collaborator
    where enterprise_id = p_enterprise_id
      and user_id = auth.uid()
      and is_active = true
  );
$$;

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.enterprise              enable row level security;
alter table public.enterprise_collaborator enable row level security;

-- enterprise: la ve el admin del tenant o sus colaboradores; escribe admin del tenant.
create policy enterprise_select on public.enterprise
  for select to authenticated
  using (public.is_admin_of(tenant_id) or public.is_enterprise_member(id));
create policy enterprise_write on public.enterprise
  for all to authenticated
  using (public.is_admin_of(tenant_id))
  with check (public.is_admin_of(tenant_id));

-- enterprise_collaborator: lo ve el propio colaborador, otros miembros o admin del tenant.
create policy enterprise_collaborator_select on public.enterprise_collaborator
  for select to authenticated
  using (
    user_id = auth.uid()
    or public.is_enterprise_member(enterprise_id)
    or exists (select 1 from public.enterprise e
               where e.id = enterprise_id and public.is_admin_of(e.tenant_id))
  );
create policy enterprise_collaborator_write on public.enterprise_collaborator
  for all to authenticated
  using (exists (select 1 from public.enterprise e
                 where e.id = enterprise_id and public.is_admin_of(e.tenant_id)))
  with check (exists (select 1 from public.enterprise e
                 where e.id = enterprise_id and public.is_admin_of(e.tenant_id)));
