import { Target } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@bsc/ui";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { OBJECTIVE_STATUS_LABEL } from "@/lib/labels";
import { ObjectiveForm } from "@/components/user/objective-form";

type ObjectiveRow = {
  id: string;
  objective_text: string;
  target_date: string;
  status: string | null;
};
type EnrollmentRow = { id: string; program_schedule_id: string | null };

export default async function MisObjetivosPage() {
  await requireRole("user");
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const objRes = await supabase
    .from("user_objective")
    .select("id, objective_text, target_date, status")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });
  const objectives = (objRes.data as ObjectiveRow[] | null) ?? [];

  // Inscripciones para el selector del formulario.
  const enrRes = await supabase
    .from("enrollment")
    .select("id, program_schedule_id")
    .eq("user_id", user!.id);
  const enrollments = (enrRes.data as EnrollmentRow[] | null) ?? [];

  const scheduleIds = enrollments
    .map((e) => e.program_schedule_id)
    .filter((x): x is string => Boolean(x));
  const titleBySchedule = new Map<string, string>();
  if (scheduleIds.length > 0) {
    const schedRes = await supabase
      .from("program_schedule")
      .select("id, program_id")
      .in("id", scheduleIds);
    const scheds =
      (schedRes.data as { id: string; program_id: string | null }[] | null) ??
      [];
    const programIds = scheds
      .map((s) => s.program_id)
      .filter((x): x is string => Boolean(x));
    const titleByProgram = new Map<string, string>();
    if (programIds.length > 0) {
      const progRes = await supabase
        .from("program")
        .select("id, title")
        .in("id", programIds);
      (progRes.data as { id: string; title: string }[] | null)?.forEach((p) =>
        titleByProgram.set(p.id, p.title),
      );
    }
    scheds.forEach((s) =>
      titleBySchedule.set(
        s.id,
        (s.program_id && titleByProgram.get(s.program_id)) || "Curso",
      ),
    );
  }

  const enrollmentOptions = enrollments.map((e) => ({
    id: e.id,
    label:
      (e.program_schedule_id && titleBySchedule.get(e.program_schedule_id)) ||
      "Curso",
  }));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-brand">
          Mis objetivos
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          Objetivos de desarrollo
        </h1>
        <p className="mt-1 text-muted-foreground">
          Declara qué quieres lograr; el centro te dará seguimiento.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Declarar objetivo</CardTitle>
        </CardHeader>
        <CardContent>
          <ObjectiveForm enrollments={enrollmentOptions} />
        </CardContent>
      </Card>

      {objectives.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <Target className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Aún no has declarado objetivos.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {objectives.map((o) => (
            <Card key={o.id}>
              <CardContent className="flex items-start justify-between gap-4 py-4">
                <div>
                  <p className="font-medium">{o.objective_text}</p>
                  <p className="text-sm text-muted-foreground">
                    Meta:{" "}
                    {new Date(o.target_date).toLocaleDateString("es-MX", {
                      dateStyle: "medium",
                    })}
                  </p>
                </div>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {OBJECTIVE_STATUS_LABEL[o.status ?? ""] ?? o.status ?? "—"}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
