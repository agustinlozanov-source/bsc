-- ============================================================================
-- BSC · Migración 0005 — INSCRIPCIONES Y OBJETIVOS
-- ============================================================================

create table public.enrollment (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profile(id),
  program_schedule_id uuid references public.program_schedule(id),
  tenant_id uuid references public.tenant(id),
  enterprise_id uuid references public.enterprise(id),
  enrollment_date timestamptz default now(),
  status text check (status in ('enrolled', 'in_progress', 'completed', 'cancelled', 'no_show')),
  completion_date timestamptz,
  payment_status text check (payment_status in ('pending', 'paid', 'refunded')),
  payment_amount numeric(10,2),
  payment_method text,
  invoice_id text,
  created_at timestamptz default now()
);

create table public.user_objective (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profile(id),
  enrollment_id uuid references public.enrollment(id),
  objective_text text not null,
  target_date date not null,
  status text check (status in ('active', 'achieved', 'not_achieved', 'in_progress', 'expired')),
  ai_followup_sent boolean default false,
  ai_followup_date timestamptz,
  ai_followup_response text,
  result_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.enterprise_objective (
  id uuid primary key default gen_random_uuid(),
  enterprise_id uuid references public.enterprise(id),
  level text check (level in ('company', 'department', 'team', 'individual')),
  department text,
  assigned_to uuid references public.user_profile(id),
  objective_text text not null,
  target_date date,
  status text check (status in ('active', 'achieved', 'not_achieved', 'in_progress')),
  parent_objective_id uuid references public.enterprise_objective(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger trg_user_objective_updated
  before update on public.user_objective
  for each row execute function public.set_updated_at();

create trigger trg_enterprise_objective_updated
  before update on public.enterprise_objective
  for each row execute function public.set_updated_at();

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.enrollment           enable row level security;
alter table public.user_objective       enable row level security;
alter table public.enterprise_objective enable row level security;

-- enrollment: el alumno ve la suya; admin del tenant; empresa vinculada.
create policy enrollment_select on public.enrollment
  for select to authenticated
  using (
    user_id = auth.uid()
    or public.is_admin_of(tenant_id)
    or (enterprise_id is not null and public.is_enterprise_member(enterprise_id))
  );
create policy enrollment_insert on public.enrollment
  for insert to authenticated
  with check (user_id = auth.uid() or public.is_admin_of(tenant_id));
create policy enrollment_update on public.enrollment
  for update to authenticated
  using (user_id = auth.uid() or public.is_admin_of(tenant_id))
  with check (user_id = auth.uid() or public.is_admin_of(tenant_id));

-- user_objective: declarado por el alumno; el alumno y el admin del tenant lo ven.
create policy user_objective_select on public.user_objective
  for select to authenticated
  using (
    user_id = auth.uid()
    or exists (select 1 from public.enrollment e
               where e.id = enrollment_id and public.is_admin_of(e.tenant_id))
  );
create policy user_objective_write on public.user_objective
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- enterprise_objective: miembros de la empresa o admin del tenant.
create policy enterprise_objective_select on public.enterprise_objective
  for select to authenticated
  using (
    public.is_enterprise_member(enterprise_id)
    or exists (select 1 from public.enterprise e
               where e.id = enterprise_id and public.is_admin_of(e.tenant_id))
  );
create policy enterprise_objective_write on public.enterprise_objective
  for all to authenticated
  using (
    public.is_enterprise_member(enterprise_id)
    or exists (select 1 from public.enterprise e
               where e.id = enterprise_id and public.is_admin_of(e.tenant_id))
  )
  with check (
    public.is_enterprise_member(enterprise_id)
    or exists (select 1 from public.enterprise e
               where e.id = enterprise_id and public.is_admin_of(e.tenant_id))
  );
