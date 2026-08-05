import { Users } from "lucide-react";
import { Card, CardContent } from "@bsc/ui";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ENROLLMENT_STATUS_LABEL } from "@/lib/labels";

type EnrollmentRow = {
  id: string;
  user_id: string | null;
  program_schedule_id: string | null;
  status: string | null;
};

export default async function MisAlumnosPage() {
  await requireRole("professional");
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profRes = await supabase
    .from("professional_profile")
    .select("id")
    .eq("user_id", user!.id)
    .maybeSingle();
  const profId = (profRes.data as { id: string } | null)?.id;

  let enrollments: EnrollmentRow[] = [];
  const programTitleBySchedule = new Map<string, string>();
  const nameByUser = new Map<string, string>();

  if (profId) {
    const progRes = await supabase
      .from("program")
      .select("id, title")
      .eq("professional_id", profId);
    const programs =
      (progRes.data as { id: string; title: string }[] | null) ?? [];
    const titleByProgram = new Map(programs.map((p) => [p.id, p.title]));
    const programIds = programs.map((p) => p.id);

    if (programIds.length > 0) {
      const schedRes = await supabase
        .from("program_schedule")
        .select("id, program_id")
        .in("program_id", programIds);
      const scheds =
        (schedRes.data as { id: string; program_id: string | null }[] | null) ??
        [];
      scheds.forEach((s) =>
        programTitleBySchedule.set(
          s.id,
          (s.program_id && titleByProgram.get(s.program_id)) || "Curso",
        ),
      );
      const scheduleIds = scheds.map((s) => s.id);

      if (scheduleIds.length > 0) {
        const enrRes = await supabase
          .from("enrollment")
          .select("id, user_id, program_schedule_id, status")
          .in("program_schedule_id", scheduleIds)
          .order("enrollment_date", { ascending: false });
        enrollments = (enrRes.data as EnrollmentRow[] | null) ?? [];

        const userIds = [
          ...new Set(
            enrollments
              .map((e) => e.user_id)
              .filter((x): x is string => Boolean(x)),
          ),
        ];
        if (userIds.length > 0) {
          const upRes = await supabase
            .from("user_profile")
            .select("id, first_name, last_name")
            .in("id", userIds);
          (
            (upRes.data as
              | { id: string; first_name: string; last_name: string }[]
              | null) ?? []
          ).forEach((u) =>
            nameByUser.set(u.id, `${u.first_name} ${u.last_name}`.trim()),
          );
        }
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-brand">
          Mis alumnos
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          Alumnos inscritos
        </h1>
        <p className="mt-1 text-muted-foreground">
          Personas inscritas en las convocatorias de tus cursos.
        </p>
      </div>

      {enrollments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Users className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Aún no tienes alumnos inscritos.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {enrollments.map((e) => (
            <Card key={e.id}>
              <CardContent className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="font-medium">
                    {(e.user_id && nameByUser.get(e.user_id)) || "Alumno"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(e.program_schedule_id &&
                      programTitleBySchedule.get(e.program_schedule_id)) ||
                      "Curso"}
                  </p>
                </div>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {ENROLLMENT_STATUS_LABEL[e.status ?? ""] ?? e.status ?? "—"}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
