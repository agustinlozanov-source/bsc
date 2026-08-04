-- ============================================================================
-- BSC · Migración 0011 — CREDENCIALES PARA TERCEROS (SaaS)
-- Gestionado por superadmin (motor de credenciales). La verificación pública
-- se habilita en la Fase 8.
-- ============================================================================

create table public.external_client (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  logo_url text,
  brand_colors jsonb,
  contact_name text,
  contact_email text,
  plan text check (plan in ('inicio', 'profesional', 'institucional')),
  max_credentials_year integer,
  credentials_issued_ytd integer default 0,
  price_usd_year numeric(10,2),
  billing_status text,
  subdomain text,
  api_key text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.external_credential_issued (
  id uuid primary key default gen_random_uuid(),
  external_client_id uuid references public.external_client(id),
  credential_id text unique not null,
  badge_name text,
  recipient_name text,
  recipient_email text,
  metadata jsonb,
  verification_url text,
  issued_at timestamptz default now(),
  verification_count integer default 0
);

create trigger trg_external_client_updated
  before update on public.external_client
  for each row execute function public.set_updated_at();

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.external_client            enable row level security;
alter table public.external_credential_issued enable row level security;

create policy external_client_all on public.external_client
  for all to authenticated
  using (public.is_superadmin()) with check (public.is_superadmin());

create policy external_credential_issued_all on public.external_credential_issued
  for all to authenticated
  using (public.is_superadmin()) with check (public.is_superadmin());
