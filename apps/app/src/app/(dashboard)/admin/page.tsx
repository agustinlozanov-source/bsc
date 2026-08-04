import { requireRole } from "@/lib/auth";
import { RoleHome } from "@/components/role-home";

export default async function AdminDashboard() {
  const ctx = await requireRole("admin");
  return (
    <RoleHome
      ctx={ctx}
      role="admin"
      intro="Panel de tu sucursal: KPIs, gestión de profesionales, alumnos, empresas y finanzas."
    />
  );
}
