-- ============================================================================
-- BSC · Migración 0009 — FINANZAS
-- ============================================================================

create table public.membership_plan (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  target_profile public.user_role not null,
  tier text not null,
  price_mxn numeric(10,2),
  billing_period text check (billing_period in ('monthly', 'quarterly', 'annual')),
  features jsonb,
  max_users integer,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table public.membership_subscription (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profile(id),
  enterprise_id uuid references public.enterprise(id),
  plan_id uuid references public.membership_plan(id),
  tenant_id uuid references public.tenant(id),
  status text check (status in ('active', 'past_due', 'cancelled', 'expired')),
  start_date date not null,
  current_period_end date,
  payment_method text,
  stripe_subscription_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.financial_transaction (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenant(id),
  type text check (type in (
    'membership_professional', 'membership_enterprise', 'membership_user_pro',
    'enrollment_tier1', 'enrollment_tier2', 'coaching', 'consultancy',
    'in_company', 'certification', 'digital_course', 'credential_service'
  )),
  description text,
  amount_gross numeric(10,2),
  amount_professional numeric(10,2),
  amount_center numeric(10,2),
  split_pct_professional numeric(3,2),
  split_pct_center numeric(3,2),
  professional_id uuid references public.professional_profile(id),
  user_id uuid references public.user_profile(id),
  enterprise_id uuid references public.enterprise(id),
  enrollment_id uuid references public.enrollment(id),
  program_id uuid references public.program(id),
  payment_status text check (payment_status in ('pending', 'paid', 'refunded', 'failed')),
  payment_date timestamptz,
  invoice_number text,
  invoice_url text,
  fiscal_concept text,
  created_at timestamptz default now()
);

create table public.expense (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenant(id),
  category text check (category in ('space', 'technology', 'personnel', 'operations', 'commercial', 'brand')),
  subcategory text,
  description text,
  amount numeric(10,2),
  date date,
  recurring boolean default false,
  invoice_url text,
  created_at timestamptz default now()
);

create trigger trg_membership_subscription_updated
  before update on public.membership_subscription
  for each row execute function public.set_updated_at();

-- Helper: admin del tenant INCLUYENDO socio read-only (para lectura de finanzas)
create or replace function public.is_tenant_admin(p_tenant_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.is_superadmin() or exists (
    select 1 from public.user_tenant_role
    where user_id = auth.uid()
      and tenant_id = p_tenant_id
      and role = 'admin'
      and is_active = true
  );
$$;

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.membership_plan         enable row level security;
alter table public.membership_subscription enable row level security;
alter table public.financial_transaction   enable row level security;
alter table public.expense                 enable row level security;

-- membership_plan: catálogo visible; escribe superadmin.
create policy membership_plan_select on public.membership_plan
  for select to authenticated using (true);
create policy membership_plan_write on public.membership_plan
  for all to authenticated
  using (public.is_superadmin()) with check (public.is_superadmin());

-- membership_subscription: titular (usuario o empresa) o admin del tenant.
create policy membership_subscription_select on public.membership_subscription
  for select to authenticated
  using (
    user_id = auth.uid()
    or (enterprise_id is not null and public.is_enterprise_member(enterprise_id))
    or public.is_tenant_admin(tenant_id)
  );
create policy membership_subscription_write on public.membership_subscription
  for all to authenticated
  using (public.is_admin_of(tenant_id))
  with check (public.is_admin_of(tenant_id));

-- financial_transaction: admin/socio del tenant (lectura), profesional o usuario
-- ven las suyas; solo el admin operativo escribe.
create policy financial_transaction_select on public.financial_transaction
  for select to authenticated
  using (
    public.is_tenant_admin(tenant_id)
    or professional_id = public.current_professional_id()
    or user_id = auth.uid()
  );
create policy financial_transaction_write on public.financial_transaction
  for all to authenticated
  using (public.is_admin_of(tenant_id))
  with check (public.is_admin_of(tenant_id));

-- expense: admin/socio del tenant lee; admin operativo escribe.
create policy expense_select on public.expense
  for select to authenticated using (public.is_tenant_admin(tenant_id));
create policy expense_write on public.expense
  for all to authenticated
  using (public.is_admin_of(tenant_id)) with check (public.is_admin_of(tenant_id));
