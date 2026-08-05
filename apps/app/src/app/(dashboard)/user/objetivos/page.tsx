import { Card, CardContent, CardHeader, CardTitle } from "@bsc/ui";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { objectiveStatus } from "@/lib/objectives";
import { ObjectiveForm } from "@/components/user/objective-form";
import {
  ObjectivesList,
  type ObjectiveItem,
  type ObjectiveCategoryRef,
  type ObjectiveUpdate,
} from "@/components/user/objectives-list";

type ObjectiveRow = {
  id: string;
  objective_text: string;
  target_date: string;
  status: string | null;
  progress_pct: number | null;
  created_at: string | null;
  achievement_note: string | null;
  enrollment_id: string | null;
};

export default async function MisObjetivosPage() {
  await requireRole("user");
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [catRes, objRes, enrRes] = await Promise.all([
    supabase
      .from("objective_category")
      .select("id, name, icon")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("user_objective")
      .select(
        "id, objective_text, target_date, status, progress_pct, created_at, achievement_note, enrollment_id",
      )
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("enrollment")
      .select("id, program_schedule_id")
      .eq("user_id", user!.id),
  ]);

  const categories = (catRes.data as ObjectiveCategoryRef[] | null) ?? [];
  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const objectives = (objRes.data as ObjectiveRow[] | null) ?? [];
  const enrollments =
    (enrRes.data as { id: string; program_schedule_id: string | null }[] | null) ??
    [];

  // Títulos de curso por inscripción.
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
  const titleByEnrollment = new Map<string, string>();
  enrollments.forEach((e) =>
    titleByEnrollment.set(
      e.id,
      (e.program_schedule_id && titleBySchedule.get(e.program_schedule_id)) ||
        "Curso",
    ),
  );

  const objectiveIds = objectives.map((o) => o.id);

  // Categorías vinculadas por objetivo.
  const categoriesByObjective = new Map<string, ObjectiveCategoryRef[]>();
  // Historial por objetivo.
  const updatesByObjective = new Map<string, ObjectiveUpdate[]>();
  if (objectiveIds.length > 0) {
    const [linkRes, updRes] = await Promise.all([
      supabase
        .from("objective_category_link")
        .select("objective_id, category_id")
        .in("objective_id", objectiveIds),
      supabase
        .from("objective_update")
        .select("id, objective_id, progress_pct, note, source, created_at")
        .in("objective_id", objectiveIds)
        .order("created_at", { ascending: false }),
    ]);
    (
      (linkRes.data as
        | { objective_id: string; category_id: string }[]
        | null) ?? []
    ).forEach((l) => {
      const cat = categoryById.get(l.category_id);
      if (!cat) return;
      const list = categoriesByObjective.get(l.objective_id) ?? [];
      list.push(cat);
      categoriesByObjective.set(l.objective_id, list);
    });
    (
      (updRes.data as (ObjectiveUpdate & { objective_id: string })[] | null) ??
      []
    ).forEach((u) => {
      const list = updatesByObjective.get(u.objective_id) ?? [];
      list.push(u);
      updatesByObjective.set(u.objective_id, list);
    });
  }

  const items: ObjectiveItem[] = objectives.map((o) => ({
    id: o.id,
    objective_text: o.objective_text,
    target_date: o.target_date,
    status: o.status,
    progress_pct: o.progress_pct,
    created_at: o.created_at,
    achievement_note: o.achievement_note,
    categories: categoriesByObjective.get(o.id) ?? [],
    courseTitle: o.enrollment_id
      ? (titleByEnrollment.get(o.enrollment_id) ?? null)
      : null,
    updates: updatesByObjective.get(o.id) ?? [],
  }));

  const enrollmentOptions = enrollments.map((e) => ({
    id: e.id,
    label: titleByEnrollment.get(e.id) ?? "Curso",
  }));

  const counts = { total: items.length, ontrack: 0, risk: 0, achieved: 0 };
  for (const o of items) {
    const st = objectiveStatus(o);
    if (st.key === "achieved") counts.achieved++;
    else if (st.color === "green") counts.ontrack++;
    else counts.risk++;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-brand">
          Mis objetivos
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          Objetivos de desarrollo
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Declarar objetivo</CardTitle>
        </CardHeader>
        <CardContent>
          <ObjectiveForm
            enrollments={enrollmentOptions}
            categories={categories}
          />
        </CardContent>
      </Card>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Total", counts.total],
            ["En tiempo", counts.ontrack],
            ["En riesgo", counts.risk],
            ["Logrados", counts.achieved],
          ].map(([label, value]) => (
            <Card key={label as string}>
              <CardContent className="py-4">
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      <ObjectivesList objectives={items} allCategories={categories} />
    </div>
  );
}
