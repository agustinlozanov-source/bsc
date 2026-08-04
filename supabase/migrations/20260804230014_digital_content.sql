-- ============================================================================
-- BSC · Migración 0014 — CONTENIDO DIGITAL (cursos grabados)
-- ============================================================================

create table public.digital_content (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references public.program(id),
  tenant_id uuid references public.tenant(id),
  professional_id uuid references public.professional_profile(id),
  title text not null,
  description text,
  modules jsonb,
  total_duration_hours numeric(6,1),
  price_mxn numeric(10,2),
  thumbnail_url text,
  is_published boolean default false,
  total_sales integer default 0,
  total_revenue numeric(12,2) default 0,
  royalty_pct numeric(3,2) default 0.20,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.digital_content_access (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profile(id),
  digital_content_id uuid references public.digital_content(id),
  access_type text check (access_type in ('purchase', 'membership', 'enterprise')),
  granted_at timestamptz default now(),
  progress_pct numeric(5,2) default 0,
  completed_at timestamptz
);

create trigger trg_digital_content_updated
  before update on public.digital_content
  for each row execute function public.set_updated_at();

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.digital_content        enable row level security;
alter table public.digital_content_access enable row level security;

-- digital_content: catálogo visible dentro del tenant; escribe profesional dueño o admin.
create policy digital_content_select on public.digital_content
  for select to authenticated using (public.has_tenant_access(tenant_id));
create policy digital_content_write on public.digital_content
  for all to authenticated
  using (professional_id = public.current_professional_id() or public.is_admin_of(tenant_id))
  with check (professional_id = public.current_professional_id() or public.is_admin_of(tenant_id));

-- digital_content_access: el propio usuario; el profesional dueño y el admin lo consultan.
create policy digital_content_access_select on public.digital_content_access
  for select to authenticated
  using (
    user_id = auth.uid()
    or exists (select 1 from public.digital_content d
               where d.id = digital_content_id
                 and (d.professional_id = public.current_professional_id()
                      or public.is_admin_of(d.tenant_id)))
  );
create policy digital_content_access_write on public.digital_content_access
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
