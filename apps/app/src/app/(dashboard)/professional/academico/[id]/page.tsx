import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type {
  FormatType,
  ModalityType,
  ProgramTier,
  SkillLevel,
  SyllabusModule,
} from "@bsc/validators";
import { formatMXN } from "@bsc/utils";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@bsc/ui";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  FORMAT_LABEL,
  MODALITY_LABEL,
  LEVEL_LABEL,
  TIER_LABEL,
} from "@/lib/labels";
import { publishProgram } from "@/app/(dashboard)/professional/academico/actions";
import { ScheduleForm } from "@/components/professional/schedule-form";

type ProgramRow = {
  id: string;
  professional_id: string | null;
  title: string;
  description: string | null;
  format: FormatType;
  modality: ModalityType;
  duration_hours: number | null;
  num_sessions: number | null;
  price_mxn: number | null;
  tier: ProgramTier | null;
  entry_profile: string | null;
  exit_profile: string | null;
  syllabus: SyllabusModule[] | null;
  is_published: boolean | null;
};

type ScheduleRow = {
  id: string;
  start_date: string;
  location: string | null;
  status: string | null;
  current_participants: number | null;
  max_participants: number | null;
};

export default async function CourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  await requireRole("professional");
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const progRes = await supabase
    .from("program")
    .select(
      "id, professional_id, title, description, format, modality, duration_hours, num_sessions, price_mxn, tier, entry_profile, exit_profile, syllabus, is_published",
    )
    .eq("id", params.id)
    .maybeSingle();
  const program = progRes.data as ProgramRow | null;
  if (!program) notFound();

  const profRes = await supabase
    .from("professional_profile")
    .select("id")
    .eq("user_id", user!.id)
    .maybeSingle();
  const isOwner =
    program.professional_id != null &&
    program.professional_id === (profRes.data as { id: string } | null)?.id;

  const psRes = await supabase
    .from("program_skill")
    .select("skill_id, target_level")
    .eq("program_id", program.id);
  const programSkills =
    (psRes.data as { skill_id: string; target_level: SkillLevel }[] | null) ??
    [];

  let skillNames: Record<string, string> = {};
  if (programSkills.length > 0) {
    const skRes = await supabase
      .from("skill")
      .select("id, name")
      .in(
        "id",
        programSkills.map((s) => s.skill_id),
      );
    skillNames = Object.fromEntries(
      ((skRes.data as { id: string; name: string }[] | null) ?? []).map((s) => [
        s.id,
        s.name,
      ]),
    );
  }

  const schedRes = await supabase
    .from("program_schedule")
    .select(
      "id, start_date, location, status, current_participants, max_participants",
    )
    .eq("program_id", program.id)
    .order("start_date", { ascending: true });
  const schedules = (schedRes.data as ScheduleRow[] | null) ?? [];

  const syllabus = program.syllabus ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/professional/academico"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Mis cursos
        </Link>
        <div className="mt-2 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {program.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {FORMAT_LABEL[program.format]} · {MODALITY_LABEL[program.modality]}
              {program.tier ? ` · ${TIER_LABEL[program.tier]}` : ""}
            </p>
          </div>
          <span
            className={
              program.is_published
                ? "rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                : "rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
            }
          >
            {program.is_published ? "Publicado" : "Borrador"}
          </span>
        </div>
      </div>

      {isOwner ? (
        <form action={publishProgram}>
          <input type="hidden" name="programId" value={program.id} />
          <input
            type="hidden"
            name="publish"
            value={program.is_published ? "0" : "1"}
          />
          <Button
            type="submit"
            variant={program.is_published ? "outline" : "default"}
            size="sm"
          >
            {program.is_published ? "Despublicar" : "Publicar"}
          </Button>
        </form>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detalles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {program.description ? (
            <p className="text-muted-foreground">{program.description}</p>
          ) : null}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">Horas</p>
              <p className="font-medium">{program.duration_hours ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Sesiones</p>
              <p className="font-medium">{program.num_sessions ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Precio</p>
              <p className="font-medium">
                {program.price_mxn != null
                  ? formatMXN(Number(program.price_mxn))
                  : "—"}
              </p>
            </div>
          </div>
          {program.entry_profile ? (
            <p>
              <span className="text-xs text-muted-foreground">
                Perfil de ingreso:{" "}
              </span>
              {program.entry_profile}
            </p>
          ) : null}
          {program.exit_profile ? (
            <p>
              <span className="text-xs text-muted-foreground">
                Perfil de egreso:{" "}
              </span>
              {program.exit_profile}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {programSkills.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Habilidades</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {programSkills.map((s) => (
              <span
                key={s.skill_id}
                className="rounded-full bg-muted px-3 py-1 text-xs"
              >
                {skillNames[s.skill_id] ?? "Habilidad"} ·{" "}
                {LEVEL_LABEL[s.target_level]}
              </span>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {syllabus.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Temario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {syllabus.map((m, i) => (
              <div key={i} className="border-b pb-2 last:border-0">
                <p className="font-medium">{m.module}</p>
                {m.topics ? (
                  <p className="text-muted-foreground">{m.topics}</p>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Convocatorias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {schedules.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Sin convocatorias programadas.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {schedules.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <span>
                    {new Date(s.start_date).toLocaleString("es-MX", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                    {s.location ? ` · ${s.location}` : ""}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {s.current_participants ?? 0}
                    {s.max_participants ? `/${s.max_participants}` : ""} inscritos
                  </span>
                </li>
              ))}
            </ul>
          )}

          {isOwner ? (
            <div className="border-t pt-4">
              <p className="mb-3 text-sm font-medium">Nueva convocatoria</p>
              <ScheduleForm programId={program.id} />
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
