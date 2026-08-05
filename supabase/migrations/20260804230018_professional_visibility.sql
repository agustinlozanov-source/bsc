-- ============================================================================
-- BSC · Migración 0018 — Visibilidad del profesional sobre sus alumnos
-- El profesional dueño de un programa puede ver las inscripciones y los
-- objetivos declarados de los alumnos en sus convocatorias.
-- (Policies permisivas adicionales; se combinan con OR con las existentes.)
-- ============================================================================

create policy enrollment_select_professional on public.enrollment
  for select to authenticated
  using (
    exists (
      select 1
      from public.program_schedule ps
      join public.program p on p.id = ps.program_id
      where ps.id = enrollment.program_schedule_id
        and p.professional_id = public.current_professional_id()
    )
  );

create policy user_objective_select_professional on public.user_objective
  for select to authenticated
  using (
    exists (
      select 1
      from public.enrollment e
      join public.program_schedule ps on ps.id = e.program_schedule_id
      join public.program p on p.id = ps.program_id
      where e.id = user_objective.enrollment_id
        and p.professional_id = public.current_professional_id()
    )
  );
