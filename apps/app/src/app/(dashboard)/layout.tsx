import { redirect } from "next/navigation";
import { getUserContext } from "@/lib/auth";

/**
 * Guarda base del grupo (dashboard): exige sesión. El shell visual (sidebar +
 * topbar) lo aporta el layout de cada rol vía <DashboardShell>.
 */
export default async function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await getUserContext();
  if (!ctx) redirect("/login");
  return <>{children}</>;
}
