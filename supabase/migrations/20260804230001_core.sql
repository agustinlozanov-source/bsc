-- ============================================================================
-- BSC · Migración 0001 — CORE
-- Tenants, perfiles, roles + funciones helper para RLS.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── Enums ───────────────────────────────────────────────────────────────────
create type public.user_role as enum (
  'superadmin', 'admin', 'professional', 'user', 'enterprise_admin'
);

-- ── Utilidad: mantener updated_at ───────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Tablas ──────────────────────────────────────────────────────────────────

create table public.tenant (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  city text not null,
  state text not null,
  address text,
  rfc text,
  razon_social text,
  phone text,
  email text,
  logo_url text,
  brand_primary_color text default '#18490e',
  brand_secondary_color text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create table public.user_profile (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  photo_url text,
  bio text,
  city text,
  state text,
  linkedin_url text,
  instagram_url text,
  website_url text,
  client_number text unique,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.user_tenant_role (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profile(id) on delete cascade,
  tenant_id uuid references public.tenant(id) on delete cascade,
  role public.user_role not null,
  is_read_only boolean default false,   -- true para socios inversionistas
  is_active boolean default true,
  created_at timestamptz default now(),
  unique (user_id, tenant_id, role)
);

create trigger trg_tenant_updated
  before update on public.tenant
  for each row execute function public.set_updated_at();

create trigger trg_user_profile_updated
  before update on public.user_profile
  for each row execute function public.set_updated_at();

-- ── Funciones helper (SECURITY DEFINER para evitar recursión de RLS) ─────────

create or replace function public.is_superadmin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_tenant_role
    where user_id = auth.uid() and role = 'superadmin' and is_active = true
  );
$$;

create or replace function public.has_tenant_access(p_tenant_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.is_superadmin() or exists (
    select 1 from public.user_tenant_role
    where user_id = auth.uid() and tenant_id = p_tenant_id and is_active = true
  );
$$;

create or replace function public.is_admin_of(p_tenant_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.is_superadmin() or exists (
    select 1 from public.user_tenant_role
    where user_id = auth.uid()
      and tenant_id = p_tenant_id
      and role = 'admin'
      and is_active = true
      and is_read_only = false        -- el socio (read only) no administra
  );
$$;

create or replace function public.shares_tenant_with(p_user_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1
    from public.user_tenant_role a
    join public.user_tenant_role b on a.tenant_id = b.tenant_id
    where a.user_id = auth.uid()
      and b.user_id = p_user_id
      and a.is_active = true
      and b.is_active = true
  );
$$;

-- ── Row Level Security ──────────────────────────────────────────────────────

alter table public.tenant            enable row level security;
alter table public.user_profile      enable row level security;
alter table public.user_tenant_role  enable row level security;

-- tenant: ven quienes pertenecen; solo superadmin crea/modifica
create policy tenant_select on public.tenant
  for select to authenticated
  using (public.has_tenant_access(id));

create policy tenant_write on public.tenant
  for all to authenticated
  using (public.is_superadmin())
  with check (public.is_superadmin());

-- user_profile: propio, superadmin, o quienes comparten tenant
create policy user_profile_select on public.user_profile
  for select to authenticated
  using (id = auth.uid() or public.is_superadmin() or public.shares_tenant_with(id));

create policy user_profile_insert on public.user_profile
  for insert to authenticated
  with check (id = auth.uid() or public.is_superadmin());

create policy user_profile_update on public.user_profile
  for update to authenticated
  using (id = auth.uid() or public.is_superadmin())
  with check (id = auth.uid() or public.is_superadmin());

-- user_tenant_role: propio (lectura), admin del tenant o superadmin gestionan
create policy utr_select on public.user_tenant_role
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin_of(tenant_id));

create policy utr_write on public.user_tenant_role
  for all to authenticated
  using (public.is_admin_of(tenant_id))
  with check (public.is_admin_of(tenant_id));
