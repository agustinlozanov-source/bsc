import { requireRole } from "@/lib/auth";
import { RoleHome } from "@/components/role-home";

export default async function UserDashboard() {
  const ctx = await requireRole("user");
  return (
    <RoleHome
      ctx={ctx}
      intro="Tu desarrollo: objetivos, cursos, credenciales y recomendaciones."
    />
  );
}
