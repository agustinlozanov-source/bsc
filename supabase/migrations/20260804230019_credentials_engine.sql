-- ============================================================================
-- BSC · Migración 0019 — Motor de credenciales (emisión + verificación)
-- ============================================================================

create sequence if not exists public.credential_seq start 1;

-- Plantilla global por defecto (idempotente)
insert into public.badge_template (
  tenant_id, name, description, image_url, criteria, is_auto_issue
)
select
  null,
  'Constancia BSC',
  'Constancia de participación y desarrollo de habilidades.',
  'https://bostonskillingcenter.com/badges/default.png',
  'Completar un programa del Boston Skilling Center.',
  true
where not exists (
  select 1 from public.badge_template
  where name = 'Constancia BSC' and tenant_id is null
);

-- Completar inscripción + emitir credencial (institucional, SECURITY DEFINER).
-- Autoriza al profesional dueño del programa o al admin del tenant.
create or replace function public.complete_and_issue(p_enrollment_id uuid)
returns text
language plpgsql
security definer set search_path = public
as $$
declare
  v_user_id uuid;
  v_tenant_id uuid;
  v_professional_id uuid;
  v_schedule_id uuid;
  v_template_id uuid;
  v_credential_id text;
  v_caller uuid := auth.uid();
  v_verify_base text := 'https://verify.bostonskillingcenter.com/credential/';
begin
  select e.user_id, e.tenant_id, e.program_schedule_id
    into v_user_id, v_tenant_id, v_schedule_id
  from public.enrollment e
  where e.id = p_enrollment_id;

  if v_user_id is null then
    raise exception 'Inscripción no encontrada';
  end if;

  select p.professional_id into v_professional_id
  from public.program_schedule ps
  join public.program p on p.id = ps.program_id
  where ps.id = v_schedule_id;

  if not (
    public.is_admin_of(v_tenant_id)
    or v_professional_id = (
      select id from public.professional_profile where user_id = v_caller limit 1
    )
  ) then
    raise exception 'No autorizado';
  end if;

  update public.enrollment
    set status = 'completed', completion_date = now()
  where id = p_enrollment_id;

  select id into v_template_id
  from public.badge_template
  where is_active = true
  order by (tenant_id is null) desc, created_at asc
  limit 1;

  v_credential_id := 'BSC-' || to_char(now(), 'YYYY') || '-'
    || lpad(nextval('public.credential_seq')::text, 5, '0');

  insert into public.credential_issued (
    credential_id, badge_template_id, user_id, tenant_id,
    program_schedule_id, verification_url
  ) values (
    v_credential_id, v_template_id, v_user_id, v_tenant_id,
    v_schedule_id, v_verify_base || v_credential_id
  );

  return v_credential_id;
end;
$$;

-- Verificación pública (sin login). Devuelve solo campos verificables y
-- registra la verificación.
create or replace function public.verify_credential(p_credential_id text)
returns json
language plpgsql
security definer set search_path = public
as $$
declare
  v json;
begin
  select to_json(t) into v from (
    select
      ci.credential_id,
      ci.issued_at,
      ci.is_revoked,
      bt.name as badge_name,
      bt.description as badge_description,
      bt.criteria,
      bt.hours_required,
      (up.first_name || ' ' || up.last_name) as recipient_name,
      tn.name as issuer
    from public.credential_issued ci
    left join public.badge_template bt on bt.id = ci.badge_template_id
    left join public.user_profile up on up.id = ci.user_id
    left join public.tenant tn on tn.id = ci.tenant_id
    where ci.credential_id = p_credential_id
  ) t;

  if v is null then
    return null;
  end if;

  update public.credential_issued
    set verification_count = coalesce(verification_count, 0) + 1,
        last_verified_at = now()
  where credential_id = p_credential_id;

  return v;
end;
$$;

grant execute on function public.complete_and_issue(uuid) to authenticated;
grant execute on function public.verify_credential(text) to anon, authenticated;
