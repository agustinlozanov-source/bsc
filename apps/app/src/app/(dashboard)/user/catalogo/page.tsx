import { BookOpen } from "lucide-react";
import type { FormatType, ModalityType } from "@bsc/validators";
import { formatMXN } from "@bsc/utils";
import { Card, CardContent } from "@bsc/ui";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { FORMAT_LABEL, MODALITY_LABEL } from "@/lib/labels";
import { EnrollButton } from "@/components/user/enroll-button";

type ProgramRow = {
  id: string;
  title: string;
  format: FormatType;
  modality: ModalityType;
  price_mxn: number | null;
};
type ScheduleRow = {
  id: string;
  program_id: string | null;
  start_date: string;
  location: string | null;
};

export default async function CatalogoPage() {
  await requireRole("user");
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const progRes = await supabase
    .from("program")
    .select("id, title, format, modality, price_mxn")
    .eq("is_published", true)
    .eq("is_active", true);
  const programs = (progRes.data as ProgramRow[] | null) ?? [];
  const programById = new Map(programs.map((p) => [p.id, p]));
  const programIds = programs.map((p) => p.id);

  let schedules: ScheduleRow[] = [];
  if (programIds.length > 0) {
    const schedRes = await supabase
      .from("program_schedule")
      .select("id, program_id, start_date, location")
      .in("program_id", programIds)
      .in("status", ["scheduled", "in_progress"])
      .order("start_date", { ascending: true });
    schedules = (schedRes.data as ScheduleRow[] | null) ?? [];
  }

  const enrRes = await supabase
    .from("enrollment")
    .select("program_schedule_id")
    .eq("user_id", user!.id);
  const enrolled = new Set(
    ((enrRes.data as { program_schedule_id: string | null }[] | null) ?? [])
      .map((e) => e.program_schedule_id)
      .filter(Boolean),
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-brand">
          Catálogo
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          Próximas convocatorias
        </h1>
        <p className="mt-1 text-muted-foreground">
          Inscríbete a los cursos publicados del centro.
        </p>
      </div>

      {schedules.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <BookOpen className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No hay convocatorias disponibles por ahora.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {schedules.map((s) => {
            const p = s.program_id ? programById.get(s.program_id) : undefined;
            if (!p) return null;
            return (
              <Card key={s.id}>
                <CardContent className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {FORMAT_LABEL[p.format]} · {MODALITY_LABEL[p.modality]} ·{" "}
                      {new Date(s.start_date).toLocaleString("es-MX", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                      {s.location ? ` · ${s.location}` : ""}
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {p.price_mxn != null ? formatMXN(Number(p.price_mxn)) : "—"}
                    </p>
                  </div>
                  {enrolled.has(s.id) ? (
                    <span className="text-sm font-medium text-brand">
                      Inscrito ✓
                    </span>
                  ) : (
                    <EnrollButton scheduleId={s.id} />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
