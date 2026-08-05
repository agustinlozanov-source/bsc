import {
  Network,
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  ClipboardList,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@bsc/ui";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function Kpi({
  label,
  value,
  Icon,
}: {
  label: string;
  value: number;
  Icon: typeof Users;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className="size-4 text-brand" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

export default async function SuperadminDashboard() {
  await requireRole("superadmin");
  const supabase = createSupabaseServerClient();

  const headCount = async (
    table:
      | "tenant"
      | "professional_profile"
      | "enterprise"
      | "program"
      | "enrollment",
  ) => {
    const { count } = await supabase
      .from(table)
      .select("id", { count: "exact", head: true });
    return count ?? 0;
  };

  const [tenants, professionals, enterprises, programs, enrollments] =
    await Promise.all([
      headCount("tenant"),
      headCount("professional_profile"),
      headCount("enterprise"),
      headCount("program"),
      headCount("enrollment"),
    ]);

  const { count: studentsCount } = await supabase
    .from("user_tenant_role")
    .select("id", { count: "exact", head: true })
    .eq("role", "user")
    .eq("is_active", true);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-brand">
          Superadmin
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          Dashboard global
        </h1>
        <p className="mt-1 text-muted-foreground">
          Consolidado de toda la red BSC.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Kpi label="Sucursales" value={tenants} Icon={Network} />
        <Kpi label="Profesionales" value={professionals} Icon={Users} />
        <Kpi label="Alumnos" value={studentsCount ?? 0} Icon={GraduationCap} />
        <Kpi label="Empresas" value={enterprises} Icon={Building2} />
        <Kpi label="Cursos" value={programs} Icon={BookOpen} />
        <Kpi label="Inscripciones" value={enrollments} Icon={ClipboardList} />
      </div>
    </div>
  );
}
