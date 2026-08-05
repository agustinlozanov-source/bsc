import { redirect } from "next/navigation";
import type { UserRole } from "@bsc/validators";
import { getUserContext } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ROLE_DASHBOARD, ROLE_LABEL } from "@/lib/roles";
import { Sidebar } from "@/components/sidebar";
import { TopBar, type OtherRole } from "@/components/top-bar";
import { GlobalSearch } from "@/components/global-search";

const PROFILE_HREF: Partial<Record<UserRole, string>> = {
  professional: "/professional/perfil",
};

/**
 * Shell de dashboard para un rol concreto: valida sesión + pertenencia al rol,
 * pinta el sidebar y el top bar global.
 */
export async function DashboardShell({
  role,
  children,
}: {
  role: UserRole;
  children: React.ReactNode;
}) {
  const ctx = await getUserContext();
  if (!ctx) redirect("/login");
  if (!ctx.roles.some((r) => r.role === role)) redirect(ctx.dashboardPath);

  const roleLabel = ROLE_LABEL[role];
  const fullName = ctx.profile
    ? `${ctx.profile.first_name} ${ctx.profile.last_name}`.trim()
    : (ctx.user.email ?? "");

  const otherRoles: OtherRole[] = [
    ...new Set(ctx.roles.map((r) => r.role)),
  ]
    .filter((r) => r !== role)
    .map((r) => ({ role: r, label: ROLE_LABEL[r], href: ROLE_DASHBOARD[r] }));

  const tenantId = ctx.roles.find((r) => r.role === role)?.tenant_id ?? null;
  let tenantName: string | null = null;
  if (tenantId) {
    const supabase = createSupabaseServerClient();
    const res = await supabase
      .from("tenant")
      .select("name")
      .eq("id", tenantId)
      .maybeSingle();
    tenantName = (res.data as { name: string } | null)?.name ?? null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <GlobalSearch primaryRole={role} />
      <TopBar
        fullName={fullName}
        roleLabel={roleLabel}
        email={ctx.user.email ?? ""}
        tenantName={tenantName}
        otherRoles={otherRoles}
        profileHref={PROFILE_HREF[role]}
      />
      <div className="flex min-h-0 flex-1">
        <Sidebar role={role} roleLabel={roleLabel} />
        <main className="min-w-0 flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
