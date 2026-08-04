-- ============================================================================
-- BSC · Migración 0016 — ÍNDICES
-- ============================================================================

create index idx_enrollment_user     on public.enrollment (user_id);
create index idx_enrollment_schedule on public.enrollment (program_schedule_id);
create index idx_enrollment_tenant   on public.enrollment (tenant_id);
create index idx_user_skill_user     on public.user_skill (user_id);
create index idx_credential_user     on public.credential_issued (user_id);
create index idx_credential_public_id on public.credential_issued (credential_id);
create index idx_financial_tenant    on public.financial_transaction (tenant_id);
create index idx_financial_type      on public.financial_transaction (type);
create index idx_notification_user   on public.notification (user_id, is_read);
create index idx_program_tenant      on public.program (tenant_id);
create index idx_booking_space       on public.space_booking (space_id, start_time, end_time);

-- Adicionales útiles para joins de RLS y multi-tenant
create index idx_utr_user            on public.user_tenant_role (user_id);
create index idx_utr_tenant          on public.user_tenant_role (tenant_id);
create index idx_professional_user   on public.professional_profile (user_id);
create index idx_enterprise_collab_user on public.enterprise_collaborator (user_id);
create index idx_program_professional on public.program (professional_id);
