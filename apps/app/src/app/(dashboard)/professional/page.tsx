import {
  BookOpen,
  CheckCircle2,
  CalendarClock,
  Star,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@bsc/ui";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProfRow = {
  id: string;
  membership_tier: string | null;
  performance_score: number | null;
  master_progress_pct: number | null;
  is_master_consultant: boolean | null;
  public_profile_slug: string | null;
};

async function getMetrics() {
  const supabase = createSupabaseServerClient();

  const profileRes = await supabase
    .from("professional_profile")
    .select(
      "id, membership_tier, performance_score, master_progress_pct, is_master_consultant, public_profile_slug",
    )
    .maybeSingle();
  const profile = profileRes.data as ProfRow | null;

  if (!profile) {
    return { profile: null };
  }

  const [activeRes, publishedRes] = await Promise.all([
    supabase
      .from("program")
      .select("id", { count: "exact", head: true })
      .eq("professional_id", profile.id)
      .eq("is_active", true),
    supabase
      .from("program")
      .select("id", { count: "exact", head: true })
      .eq("professional_id", profile.id)
      .eq("is_published", true),
  ]);

  // Próximos eventos: schedules de mis programas con fecha futura.
  const programsRes = await supabase
    .from("program")
    .select("id")
    .eq("professional_id", profile.id);
  const programIds = ((programsRes.data ?? []) as { id: string }[]).map(
    (p) => p.id,
  );

  let upcoming = 0;
  if (programIds.length > 0) {
    const { count } = await supabase
      .from("program_schedule")
      .select("id", { count: "exact", head: true })
      .in("program_id", programIds)
      .gte("start_date", new Date().toISOString())
      .in("status", ["scheduled", "in_progress"]);
    upcoming = count ?? 0;
  }

  return {
    profile,
    programsActive: activeRes.count ?? 0,
    programsPublished: publishedRes.count ?? 0,
    upcoming,
  };
}

function MetricCard({
  label,
  value,
  hint,
  Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  Icon: typeof BookOpen;
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
        {hint ? (
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default async function ProfessionalDashboard() {
  const ctx = await requireRole("professional");
  const firstName = ctx.profile?.first_name ?? ctx.user.email;
  const metrics = await getMetrics();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-brand">
          Profesional
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          Hola, {firstName}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Resumen de tu actividad en el centro.
        </p>
      </div>

      {!metrics.profile ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Aún no tienes perfil profesional
            </CardTitle>
            <CardDescription>
              Tu cuenta tiene el rol de profesional, pero falta crear tu ficha
              (professional_profile). En cuanto exista, verás aquí tus métricas.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Cursos activos"
              value={metrics.programsActive}
              Icon={BookOpen}
            />
            <MetricCard
              label="Publicados"
              value={metrics.programsPublished}
              Icon={CheckCircle2}
            />
            <MetricCard
              label="Próximos eventos"
              value={metrics.upcoming}
              Icon={CalendarClock}
            />
            <MetricCard
              label="Score de desempeño"
              value={
                metrics.profile.performance_score != null
                  ? Number(metrics.profile.performance_score).toFixed(2)
                  : "—"
              }
              hint="Promedio de evaluaciones anónimas"
              Icon={Star}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Consultor Master BSC</CardTitle>
              <CardDescription>
                {metrics.profile.is_master_consultant
                  ? "Ya eres Consultor Master."
                  : "Avance hacia la certificación de Consultor Master."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{
                      width: `${Math.min(
                        100,
                        Number(metrics.profile.master_progress_pct ?? 0),
                      )}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {Number(metrics.profile.master_progress_pct ?? 0).toFixed(0)}%
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Membresía:{" "}
                <span className="font-medium text-foreground">
                  {metrics.profile.membership_tier ?? "—"}
                </span>
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
