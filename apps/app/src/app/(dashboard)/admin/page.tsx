import Link from "next/link";
import { Users, GraduationCap, Building2, BookOpen, ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@bsc/ui";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function countIn(
  supabase: ReturnType<typeof createSupabaseServerClient>,
  table: "professional_profile" | "enterprise" | "program" | "enrollment",
  tenantId: string,
) {
  const { count } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tenantId);
  return count ?? 0;
}

function Kpi({
  label,
  value,
  href,
  Icon,
}: {
  label: string;
  value: number;
  href?: string;
  Icon: typeof Users;
}) {
  const inner = (
    <Card className={href ? "transition-colors hover:border-primary/40" : ""}>
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
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default async function AdminDashboard() {
  const ctx = await requireRole("admin");
  const tenantId = ctx.roles.find((r) => r.role === "admin")?.tenant_id ?? null;
  const supabase = createSupabaseServerClient();

  let professionals = 0;
  let enterprises = 0;
  let programs = 0;
  let enrollments = 0;
  let students = 0;

  if (tenantId) {
    [professionals, enterprises, programs, enrollments] = await Promise.all([
      countIn(supabase, "professional_profile", tenantId),
      countIn(supabase, "enterprise", tenantId),
      countIn(supabase, "program", tenantId),
      countIn(supabase, "enrollment", tenantId),
    ]);
    const { count } = await supabase
      .from("user_tenant_role")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("role", "user")
      .eq("is_active", true);
    students = count ?? 0;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-brand">
          Admin de sucursal
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          Panel de la sucursal
        </h1>
        <p className="mt-1 text-muted-foreground">
          Indicadores clave de tu tenant.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Kpi
          label="Profesionales"
          value={professionals}
          href="/admin/profesionales"
          Icon={Users}
        />
        <Kpi
          label="Alumnos"
          value={students}
          href="/admin/alumnos"
          Icon={GraduationCap}
        />
        <Kpi
          label="Empresas"
          value={enterprises}
          href="/admin/empresas"
          Icon={Building2}
        />
        <Kpi label="Cursos" value={programs} Icon={BookOpen} />
        <Kpi label="Inscripciones" value={enrollments} Icon={ClipboardList} />
      </div>
    </div>
  );
}
