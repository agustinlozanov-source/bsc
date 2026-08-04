import { redirect } from "next/navigation";
import { getUserContext } from "@/lib/auth";
import { ROLE_LABEL } from "@/lib/roles";
import { NAV_BY_ROLE } from "@/lib/navigation";
import { Sidebar } from "@/components/sidebar";
import { SignOutButton } from "@/components/sign-out-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await getUserContext();
  if (!ctx) redirect("/login");
  if (!ctx.primaryRole) {
    // Autenticado pero sin rol asignado.
    redirect("/login");
  }

  const roleLabel = ROLE_LABEL[ctx.primaryRole];
  const items = NAV_BY_ROLE[ctx.primaryRole];
  const fullName = ctx.profile
    ? `${ctx.profile.first_name} ${ctx.profile.last_name}`.trim()
    : ctx.user.email;

  return (
    <div className="flex min-h-screen">
      <Sidebar items={items} roleLabel={roleLabel} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b bg-card px-5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{fullName}</span>
            {ctx.isReadOnly ? (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                Solo lectura (socio)
              </span>
            ) : null}
          </div>
          <SignOutButton />
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
