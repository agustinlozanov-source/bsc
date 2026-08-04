-- ============================================================================
-- BSC · Migración 0003 — ACADÉMICO (skills, programas)
-- ============================================================================

create type public.format_type as enum (
  'conference', 'workshop', 'course', 'diploma', 'coaching', 'consultancy'
);

create type public.modality_type as enum (
  'presencial', 'online', 'hybrid'
);

create table public.skill (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  subcategory text,
  description text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table public.program (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenant(id),
  professional_id uuid references public.professional_profile(id),
  title text not null,
  description text,
  format public.format_type not null,
  modality public.modality_type not null,
  duration_hours numeric(6,1),
  num_sessions integer,
  syllabus jsonb,
  entry_profile text,
  exit_profile text,
  max_participants integer,
  price_mxn numeric(10,2),
  tier text check (tier in ('tier1', 'tier2')),
  split_professional numeric(3,2),
  split_center numeric(3,2),
  is_recordable boolean default false,
  is_published boolean default false,
  is_active boolean default true,
  methodology_validated boolean default false,
  methodology_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.program_skill (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references public.program(id) on delete cascade,
  skill_id uuid references public.skill(id),
  target_level text check (target_level in ('basic', 'intermediate', 'advanced', 'expert')),
  weight numeric(3,2) default 1.0
);

create table public.program_schedule (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references public.program(id),
  tenant_id uuid references public.tenant(id),
  start_date timestamptz not null,
  end_date timestamptz,
  sessions jsonb,
  location text,
  status text check (status in ('scheduled', 'in_progress', 'completed', 'cancelled')),
  max_participants integer,
  current_participants integer default 0,
  created_at timestamptz default now()
);

create trigger trg_program_updated
  before update on public.program
  for each row execute function public.set_updated_at();

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.skill            enable row level security;
alter table public.program          enable row level security;
alter table public.program_skill    enable row level security;
alter table public.program_schedule enable row level security;

-- skill: catálogo maestro. Lectura para todo autenticado; escribe superadmin.
create policy skill_select on public.skill
  for select to authenticated using (true);
create policy skill_write on public.skill
  for all to authenticated
  using (public.is_superadmin()) with check (public.is_superadmin());

-- program: visible dentro del tenant; escribe el profesional dueño o el admin.
create policy program_select on public.program
  for select to authenticated using (public.has_tenant_access(tenant_id));
create policy program_insert on public.program
  for insert to authenticated
  with check (professional_id = public.current_professional_id() or public.is_admin_of(tenant_id));
create policy program_update on public.program
  for update to authenticated
  using (professional_id = public.current_professional_id() or public.is_admin_of(tenant_id))
  with check (professional_id = public.current_professional_id() or public.is_admin_of(tenant_id));

-- program_skill: sigue el acceso del programa padre.
create policy program_skill_select on public.program_skill
  for select to authenticated
  using (exists (select 1 from public.program p
                 where p.id = program_id and public.has_tenant_access(p.tenant_id)));
create policy program_skill_write on public.program_skill
  for all to authenticated
  using (exists (select 1 from public.program p
                 where p.id = program_id
                   and (p.professional_id = public.current_professional_id()
                        or public.is_admin_of(p.tenant_id))))
  with check (exists (select 1 from public.program p
                 where p.id = program_id
                   and (p.professional_id = public.current_professional_id()
                        or public.is_admin_of(p.tenant_id))));

-- program_schedule: visible dentro del tenant; escribe admin o profesional dueño.
create policy program_schedule_select on public.program_schedule
  for select to authenticated using (public.has_tenant_access(tenant_id));
create policy program_schedule_write on public.program_schedule
  for all to authenticated
  using (
    public.is_admin_of(tenant_id)
    or exists (select 1 from public.program p
               where p.id = program_id and p.professional_id = public.current_professional_id())
  )
  with check (
    public.is_admin_of(tenant_id)
    or exists (select 1 from public.program p
               where p.id = program_id and p.professional_id = public.current_professional_id())
  );
