-- ============================================================================
-- BSC · Migración 0020 — Objetivos v2 (categorías, progreso, historial)
-- ============================================================================

-- Categorías de objetivo (badges), gestionadas desde Superadmin.
create table public.objective_category (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text,                                  -- emoji
  description text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Nuevas columnas en user_objective
alter table public.user_objective
  add column progress_pct numeric(5,2) default 0,
  add column category_id uuid references public.objective_category(id),
  add column achieved_at timestamptz,
  add column achievement_note text;

-- Historial de actualizaciones (timeline)
create table public.objective_update (
  id uuid primary key default gen_random_uuid(),
  objective_id uuid references public.user_objective(id) on delete cascade,
  progress_pct numeric(5,2),
  note text,
  source text check (source in ('student', 'ai_agent')) default 'student',
  created_at timestamptz default now()
);

create index idx_objective_update_objective on public.objective_update (objective_id);

-- ── Seed de categorías (idempotente) ────────────────────────────────────────
insert into public.objective_category (name, icon, sort_order)
select v.name, v.icon, v.ord
from (values
  ('Escalar mi empresa', '💼', 1),
  ('Ascenso laboral', '📈', 2),
  ('Dominar una skill', '🎯', 3),
  ('Incremento salarial', '💰', 4),
  ('Cambio de carrera', '🔄', 5),
  ('Emprender', '💡', 6)
) as v(name, icon, ord)
where not exists (
  select 1 from public.objective_category c where c.name = v.name
);

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.objective_category enable row level security;
alter table public.objective_update   enable row level security;

-- Catálogo de categorías: lectura para autenticados; escribe superadmin.
create policy objective_category_select on public.objective_category
  for select to authenticated using (true);
create policy objective_category_write on public.objective_category
  for all to authenticated
  using (public.is_superadmin()) with check (public.is_superadmin());

-- Historial: lo ve el dueño del objetivo o el profesional del curso; lo escribe
-- el dueño del objetivo.
create policy objective_update_select on public.objective_update
  for select to authenticated
  using (
    exists (
      select 1 from public.user_objective o
      where o.id = objective_update.objective_id
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
create policy objective_update_insert on public.objective_update
  for insert to authenticated
  with check (
    exists (
      select 1 from public.user_objective o
      where o.id = objective_update.objective_id and o.user_id = auth.uid()
    )
  );
