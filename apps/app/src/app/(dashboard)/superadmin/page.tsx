import { requireRole } from "@/lib/auth";
import { RoleHome } from "@/components/role-home";

export default async function SuperadminDashboard() {
  const ctx = await requireRole("superadmin");
  return (
    <RoleHome
      ctx={ctx}
      intro="Panel global de la red BSC. Aquí verás el consolidado de todas las sucursales."
    />
  );
}
