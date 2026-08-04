-- ============================================================================
-- BSC · Migración 0012 — CALENDARIO Y ESPACIOS
-- ============================================================================

create table public.space (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenant(id),
  name text not null,
  type text check (type in ('classroom', 'meeting_room', 'coworking', 'studio')),
  capacity integer,
  equipment text[],
  is_recordable boolean default false,
  is_active boolean default true
);

create table public.space_booking (
  id uuid primary key default gen_random_uuid(),
  space_id uuid references public.space(id),
  tenant_id uuid references public.tenant(id),
  booked_by uuid references public.user_profile(id),
  program_schedule_id uuid references public.program_schedule(id),
  title text,
  start_time timestamptz not null,
  end_time timestamptz not null,
  type text check (type in ('program', 'meeting', 'coaching', 'consultancy', 'personal')),
  priority integer default 1,
  status text check (status in ('confirmed', 'tentative', 'cancelled')),
  created_at timestamptz default now()
);

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.space         enable row level security;
alter table public.space_booking enable row level security;

create policy space_select on public.space
  for select to authenticated using (public.has_tenant_access(tenant_id));
create policy space_write on public.space
  for all to authenticated
  using (public.is_admin_of(tenant_id)) with check (public.is_admin_of(tenant_id));

-- space_booking: la agenda del centro es visible; reserva/edita el autor o el admin.
create policy space_booking_select on public.space_booking
  for select to authenticated using (public.has_tenant_access(tenant_id));
create policy space_booking_write on public.space_booking
  for all to authenticated
  using (booked_by = auth.uid() or public.is_admin_of(tenant_id))
  with check (booked_by = auth.uid() or public.is_admin_of(tenant_id));
