import "server-only";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import type { UserRole } from "@bsc/validators";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { pickPrimaryRole, ROLE_DASHBOARD } from "@/lib/roles";

export type TenantRole = {
  role: UserRole;
  tenant_id: string | null;
  is_read_only: boolean;
};

export type UserContext = {
  user: User;
  profile: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  roles: TenantRole[];
  primaryRole: UserRole | null;
  /** true si el rol primario es admin socio (solo lectura). */
  isReadOnly: boolean;
  dashboardPath: string;
};

/**
 * Contexto del usuario autenticado: perfil, roles por tenant y rol primario.
 * Devuelve null si no hay sesión.
 */
export async function getUserContext(): Promise<UserContext | null> {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const profileResult = await supabase
    .from("user_profile")
    .select("id, first_name, last_name, email")
    .eq("id", user.id)
    .maybeSingle();
  const profile = profileResult.data;

  const roleResult = await supabase
    .from("user_tenant_role")
    .select("role, tenant_id, is_read_only")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .returns<
      { role: UserRole; tenant_id: string | null; is_read_only: boolean | null }[]
    >();
  const roleRows = roleResult.data ?? [];

  const roles: TenantRole[] = roleRows.map((r) => ({
    role: r.role,
    tenant_id: r.tenant_id,
    is_read_only: r.is_read_only ?? false,
  }));

  const primaryRole = pickPrimaryRole(roles.map((r) => r.role));
  const primary = primaryRole
    ? roles.find((r) => r.role === primaryRole)
    : undefined;

  return {
    user,
    profile: profile ?? null,
    roles,
    primaryRole,
    isReadOnly: primary?.is_read_only ?? false,
    dashboardPath: primaryRole ? ROLE_DASHBOARD[primaryRole] : "/login",
  };
}

/**
 * Exige sesión y que el usuario tenga el rol indicado. Si no hay sesión,
 * redirige a /login; si tiene sesión pero otro rol, lo manda a su dashboard.
 */
export async function requireRole(role: UserRole): Promise<UserContext> {
  const ctx = await getUserContext();
  if (!ctx) redirect("/login");
  const hasRole = ctx.roles.some((r) => r.role === role);
  if (!hasRole) redirect(ctx.dashboardPath);
  return ctx;
}
