import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { FormatType, ModalityType } from "@bsc/validators";
import { buttonVariants, Card, CardContent } from "@bsc/ui";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  ENROLLMENT_STATUS_LABEL,
  FORMAT_LABEL,
  MODALITY_LABEL,
} from "@/lib/labels";

type EnrollmentRow = {
  id: string;
  status: string | null;
  program_schedule_id: string | null;
};
type ScheduleRow = {
  id: string;
  program_id: string | null;
  start_date: string;
};
type ProgramRow = {
  id: string;
  title: string;
  format: FormatType;
  modality: ModalityType;
};

export default async function MisCursosPage() {
  await requireRole("user");
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const enrRes = await supabase
    .from("enrollment")
    .select("id, status, program_schedule_id")
    .eq("user_id", user!.id)
    .order("enrollment_date", { ascending: false });
  const enrollments = (enrRes.data as EnrollmentRow[] | null) ?? [];

  const scheduleIds = enrollments
    .map((e) => e.program_schedule_id)
    .filter((x): x is string => Boolean(x));

  const schedById = new Map<string, ScheduleRow>();
  const programById = new Map<string, ProgramRow>();
  if (scheduleIds.length > 0) {
    const schedRes = await supabase
      .from("program_schedule")
      .select("id, program_id, start_date")
      .in("id", scheduleIds);
    const scheds = (schedRes.data as ScheduleRow[] | null) ?? [];
    scheds.forEach((s) => schedById.set(s.id, s));

    const programIds = scheds
      .map((s) => s.program_id)
      .filter((x): x is string => Boolean(x));
    if (programIds.length > 0) {
      const progRes = await supabase
        .from("program")
        .select("id, title, format, modality")
        .in("id", programIds);
      (progRes.data as ProgramRow[] | null)?.forEach((p) =>
        programById.set(p.id, p),
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-brand">
            Mis cursos
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Cursos inscritos
          </h1>
        </div>
        <Link href="/user/catalogo" className={buttonVariants()}>
          Explorar catálogo
        </Link>
      </div>

      {enrollments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <BookOpen className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Aún no estás inscrito en ningún curso.
            </p>
            <Link
              href="/user/catalogo"
              className={buttonVariants({ variant: "outline" })}
            >
              Ver catálogo
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {enrollments.map((e) => {
            const sched = e.program_schedule_id
              ? schedById.get(e.program_schedule_id)
              : undefined;
            const program = sched?.program_id
              ? programById.get(sched.program_id)
              : undefined;
            return (
              <Card key={e.id}>
                <CardContent className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <p className="font-medium">
                      {program?.title ?? "Curso"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {program
                        ? `${FORMAT_LABEL[program.format]} · ${MODALITY_LABEL[program.modality]}`
                        : ""}
                      {sched
                        ? ` · ${new Date(sched.start_date).toLocaleDateString("es-MX", { dateStyle: "medium" })}`
                        : ""}
                    </p>
                  </div>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {ENROLLMENT_STATUS_LABEL[e.status ?? ""] ?? e.status ?? "—"}
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
