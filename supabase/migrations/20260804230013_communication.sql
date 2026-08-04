-- ============================================================================
-- BSC · Migración 0013 — COMUNICACIÓN
-- ============================================================================

create table public.notification (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profile(id),
  tenant_id uuid references public.tenant(id),
  type text,
  title text,
  message text,
  link text,
  is_read boolean default false,
  created_at timestamptz default now()
);

create table public.message (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid references public.user_profile(id),
  to_user_id uuid references public.user_profile(id),
  tenant_id uuid references public.tenant(id),
  subject text,
  body text,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.notification enable row level security;
alter table public.message      enable row level security;

-- notification: cada quien ve/actualiza (marcar leída) las suyas.
create policy notification_select on public.notification
  for select to authenticated using (user_id = auth.uid());
create policy notification_update on public.notification
  for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy notification_insert on public.notification
  for insert to authenticated
  with check (public.is_admin_of(tenant_id) or user_id = auth.uid());

-- message: remitente y destinatario.
create policy message_select on public.message
  for select to authenticated
  using (from_user_id = auth.uid() or to_user_id = auth.uid());
create policy message_insert on public.message
  for insert to authenticated
  with check (from_user_id = auth.uid());
create policy message_update on public.message
  for update to authenticated
  using (to_user_id = auth.uid()) with check (to_user_id = auth.uid());
