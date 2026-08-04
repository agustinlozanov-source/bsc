import { requireRole } from "@/lib/auth";
import { RoleHome } from "@/components/role-home";

export default async function ProfessionalDashboard() {
  const ctx = await requireRole("professional");
  return (
    <RoleHome
      ctx={ctx}
      intro="Tu portal: cursos, alumnos, finanzas y seguimiento de objetivos."
    />
  );
}
