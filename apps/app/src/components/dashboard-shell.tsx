import Link from "next/link";
import { redirect } from "next/navigation";
import type { UserRole } from "@bsc/validators";
import { getUserContext } from "@/lib/auth";
import { ROLE_DASHBOARD, ROLE_LABEL } from "@/lib/roles";
import { Sidebar } from "@/components/sidebar";
import { SignOutButton } from "@/components/sign-out-button";

/**
 * Shell de dashboard para un rol concreto: valida sesión + pertenencia al rol,
 * pinta el sidebar y la barra superior. Soporta usuarios multi-rol con un
 * selector "Ver como".
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
    : ctx.user.email;
  const isReadOnly =
    ctx.roles.find((r) => r.role === role)?.is_read_only ?? false;
  const otherRoles = [...new Set(ctx.roles.map((r) => r.role))].filter(
    (r) => r !== role,
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} roleLabel={roleLabel} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-card px-5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{fullName}</span>
            {isReadOnly ? (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                Solo lectura (socio)
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            {otherRoles.length > 0 ? (
              <div className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
                <span>Ver como:</span>
                {otherRoles.map((r) => (
                  <Link
                    key={r}
                    href={ROLE_DASHBOARD[r]}
                    className="rounded px-2 py-1 font-medium text-foreground/80 hover:bg-muted"
                  >
                    {ROLE_LABEL[r]}
                  </Link>
                ))}
              </div>
            ) : null}
            <SignOutButton />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
