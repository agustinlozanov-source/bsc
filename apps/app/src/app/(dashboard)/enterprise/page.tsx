import { requireRole } from "@/lib/auth";
import { RoleHome } from "@/components/role-home";

export default async function EnterpriseDashboard() {
  const ctx = await requireRole("enterprise_admin");
  return (
    <RoleHome
      ctx={ctx}
      role="enterprise_admin"
      intro="Portal de tu empresa: equipo, mapa de competencias, objetivos y credenciales."
    />
  );
}
