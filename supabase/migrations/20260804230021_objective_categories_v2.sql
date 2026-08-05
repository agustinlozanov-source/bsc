-- ============================================================================
-- BSC · Migración 0021 — Categorías de objetivo: catálogo amplio (íconos Lucide)
-- + selección múltiple (muchos-a-muchos)
-- ============================================================================

-- El campo icon ahora guarda el NOMBRE de un ícono Lucide (no emoji).
-- Actualizamos las 6 categorías previas.
update public.objective_category set icon = 'Building2'   where name = 'Escalar mi empresa';
update public.objective_category set icon = 'TrendingUp'  where name = 'Ascenso laboral';
update public.objective_category set icon = 'Target'      where name = 'Dominar una skill';
update public.objective_category set icon = 'DollarSign'  where name = 'Incremento salarial';
update public.objective_category set icon = 'Route'       where name = 'Cambio de carrera';
update public.objective_category set icon = 'Rocket'      where name = 'Emprender';

-- Catálogo ampliado (idempotente por nombre).
insert into public.objective_category (name, icon, sort_order)
select v.name, v.icon, v.ord
from (values
  ('Nuevo empleo', 'Briefcase', 7),
  ('Reconocimiento profesional', 'Award', 8),
  ('Aprender tecnología nueva', 'Cpu', 9),
  ('Mejorar comunicación', 'MessageCircle', 10),
  ('Liderazgo', 'Users', 11),
  ('Pensamiento estratégico', 'Brain', 12),
  ('Productividad', 'Zap', 13),
  ('Idiomas', 'Languages', 14),
  ('Análisis de datos', 'BarChart3', 15),
  ('Gestión de proyectos', 'ClipboardList', 16),
  ('Aumentar ventas', 'LineChart', 17),
  ('Reducir costos', 'TrendingDown', 18),
  ('Transformación digital', 'MonitorSmartphone', 19),
  ('Innovación', 'Lightbulb', 20),
  ('Expansión de mercado', 'Globe', 21),
  ('Finanzas personales', 'Wallet', 22),
  ('Inversión', 'PiggyBank', 23),
  ('Independencia financiera', 'Coins', 24),
  ('Balance vida-trabajo', 'Scale', 25),
  ('Bienestar y salud', 'HeartPulse', 26),
  ('Networking', 'Network', 27),
  ('Mentoría', 'GraduationCap', 28),
  ('Marca personal', 'BadgeCheck', 29)
) as v(name, icon, ord)
where not exists (
  select 1 from public.objective_category c where c.name = v.name
);

-- ── Muchos-a-muchos: objetivo ↔ categorías ─────────────────────────────────
create table public.objective_category_link (
  id uuid primary key default gen_random_uuid(),
  objective_id uuid references public.user_objective(id) on delete cascade,
  category_id uuid references public.objective_category(id) on delete cascade,
  created_at timestamptz default now(),
  unique (objective_id, category_id)
);

create index idx_obj_cat_link_objective on public.objective_category_link (objective_id);

-- Migrar la categoría única existente al nuevo vínculo.
insert into public.objective_category_link (objective_id, category_id)
select id, category_id
from public.user_objective
where category_id is not null
on conflict do nothing;

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.objective_category_link enable row level security;

create policy objective_category_link_select on public.objective_category_link
  for select to authenticated
  using (
    exists (
      select 1 from public.user_objective o
      where o.id = objective_category_link.objective_id
        and (
          o.user_id = auth.uid()
          or exists (
            select 1
            from public.enrollment e
            join public.program_schedule ps on ps.id = e.program_schedule_id
            join public.program p on p.id = ps.program_id
            where e.id = o.enrollment_id
              and p.professional_id = public.current_professional_id()
          )
        )
    )
  );

create policy objective_category_link_write on public.objective_category_link
  for all to authenticated
  using (
    exists (
      select 1 from public.user_objective o
      where o.id = objective_category_link.objective_id and o.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.user_objective o
      where o.id = objective_category_link.objective_id and o.user_id = auth.uid()
    )
  );
