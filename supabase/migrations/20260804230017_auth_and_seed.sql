-- ============================================================================
-- BSC · Migración 0017 — AUTH (trigger de perfil) + SEED de catálogo
-- ============================================================================

-- ── Al registrarse un usuario en auth.users: crear su user_profile y, si existe
--    un tenant por defecto activo, asignarle el rol 'user' (alumno). ────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  insert into public.user_profile (id, first_name, last_name, email)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'first_name', ''), split_part(new.email, '@', 1)),
    coalesce(nullif(new.raw_user_meta_data ->> 'last_name', ''), ''),
    new.email
  )
  on conflict (id) do nothing;

  -- Tenant por defecto (primera sucursal activa) para el rol de alumno.
  select id into v_tenant_id
  from public.tenant
  where is_active = true and deleted_at is null
  order by created_at asc
  limit 1;

  if v_tenant_id is not null then
    insert into public.user_tenant_role (user_id, tenant_id, role)
    values (new.id, v_tenant_id, 'user')
    on conflict (user_id, tenant_id, role) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Seed: tenant Reynosa (idempotente) ──────────────────────────────────────
insert into public.tenant (name, slug, city, state, razon_social)
select 'BSC Reynosa', 'reynosa', 'Reynosa', 'Tamaulipas', 'Boston Skilling Center Reynosa'
where not exists (select 1 from public.tenant where slug = 'reynosa');

-- ── Seed: catálogo base de habilidades (idempotente por nombre) ─────────────
insert into public.skill (name, category, subcategory)
select v.name, v.category, v.subcategory
from (values
  ('Liderazgo de equipos', 'Liderazgo', 'Gestión de personas'),
  ('Comunicación efectiva', 'Habilidades blandas', 'Comunicación'),
  ('Pensamiento estratégico', 'Estrategia', 'Planeación'),
  ('Análisis de datos', 'Tecnología', 'Datos'),
  ('Gestión de proyectos', 'Gestión', 'Operaciones'),
  ('Negociación', 'Comercial', 'Ventas'),
  ('Finanzas para no financieros', 'Finanzas', 'Fundamentos'),
  ('Transformación digital', 'Tecnología', 'Innovación')
) as v(name, category, subcategory)
where not exists (select 1 from public.skill s where s.name = v.name);
