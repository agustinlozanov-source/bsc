-- ============================================================================
-- BSC · Migración 0010 — AGENTES IA
-- ============================================================================

create table public.ai_agent_config (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenant(id),   -- null = global
  name text not null,
  purpose text,
  message_templates jsonb,
  channels text[] default '{"email"}',
  tone text default 'professional',
  frequency_rules jsonb,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table public.ai_followup_message (
  id uuid primary key default gen_random_uuid(),
  agent_config_id uuid references public.ai_agent_config(id),
  objective_id uuid references public.user_objective(id),
  enterprise_objective_id uuid references public.enterprise_objective(id),
  user_id uuid references public.user_profile(id),
  channel text check (channel in ('email', 'whatsapp', 'platform')),
  message_sent text,
  sent_at timestamptz,
  response_received text,
  responded_at timestamptz,
  status text check (status in ('scheduled', 'sent', 'delivered', 'responded', 'no_response')),
  created_at timestamptz default now()
);

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.ai_agent_config     enable row level security;
alter table public.ai_followup_message enable row level security;

-- ai_agent_config: global lo gestiona superadmin; por tenant, su admin.
create policy ai_agent_config_select on public.ai_agent_config
  for select to authenticated
  using (tenant_id is null or public.has_tenant_access(tenant_id));
create policy ai_agent_config_write on public.ai_agent_config
  for all to authenticated
  using ((tenant_id is null and public.is_superadmin()) or public.is_admin_of(tenant_id))
  with check ((tenant_id is null and public.is_superadmin()) or public.is_admin_of(tenant_id));

-- ai_followup_message: el destinatario lo ve; la escritura la hace el sistema
-- (service role) o el superadmin desde configuración.
create policy ai_followup_message_select on public.ai_followup_message
  for select to authenticated
  using (user_id = auth.uid() or public.is_superadmin());
create policy ai_followup_message_write on public.ai_followup_message
  for all to authenticated
  using (public.is_superadmin()) with check (public.is_superadmin());
