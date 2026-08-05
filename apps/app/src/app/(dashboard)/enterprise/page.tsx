import { Users, Target, ClipboardList } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@bsc/ui";
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

export default async function EnterpriseDashboard() {
  await requireRole("enterprise_admin");
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const memberRes = await supabase
    .from("enterprise_collaborator")
    .select("enterprise_id")
    .eq("user_id", user!.id)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();
  const enterpriseId = (memberRes.data as { enterprise_id: string | null } | null)
    ?.enterprise_id;

  if (!enterpriseId) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Portal de empresa</h1>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Sin empresa vinculada
            </CardTitle>
            <CardDescription>
              Tu cuenta tiene rol de empresa pero aún no está asociada a una
              organización. El admin de la sucursal debe vincularte como
              colaborador.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const entRes = await supabase
    .from("enterprise")
    .select("name")
    .eq("id", enterpriseId)
    .maybeSingle();
  const name = (entRes.data as { name: string } | null)?.name ?? "Mi empresa";

  const [{ count: collaborators }, { count: objectives }, { count: enrollments }] =
    await Promise.all([
      supabase
        .from("enterprise_collaborator")
        .select("id", { count: "exact", head: true })
        .eq("enterprise_id", enterpriseId)
        .eq("is_active", true),
      supabase
        .from("enterprise_objective")
        .select("id", { count: "exact", head: true })
        .eq("enterprise_id", enterpriseId),
      supabase
        .from("enrollment")
        .select("id", { count: "exact", head: true })
        .eq("enterprise_id", enterpriseId),
    ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-brand">
          Empresa
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">{name}</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi label="Colaboradores" value={collaborators ?? 0} Icon={Users} />
        <Kpi label="Objetivos" value={objectives ?? 0} Icon={Target} />
        <Kpi
          label="Inscripciones"
          value={enrollments ?? 0}
          Icon={ClipboardList}
        />
      </div>
    </div>
  );
}
