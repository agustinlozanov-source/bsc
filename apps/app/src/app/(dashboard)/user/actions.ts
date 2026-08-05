"use server";

import { revalidatePath } from "next/cache";
import {
  declareObjectiveSchema,
  editObjectiveSchema,
  type DeclareObjectiveInput,
  type EditObjectiveInput,
} from "@bsc/validators";
import type { Database } from "@bsc/db/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Tables = Database["public"]["Tables"];

export type EnrollResult = { error?: string; ok?: boolean };

export async function enrollInSchedule(
  _prev: EnrollResult | undefined,
  formData: FormData,
): Promise<EnrollResult> {
  const scheduleId = String(formData.get("scheduleId") ?? "");
  if (!scheduleId) return { error: "Falta la convocatoria" };

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión expirada" };

  const schedRes = await supabase
    .from("program_schedule")
    .select("tenant_id")
    .eq("id", scheduleId)
    .maybeSingle();
  const tenantId = (schedRes.data as { tenant_id: string | null } | null)
    ?.tenant_id;

  const existing = await supabase
    .from("enrollment")
    .select("id")
    .eq("user_id", user.id)
    .eq("program_schedule_id", scheduleId)
    .maybeSingle();
  if ((existing.data as { id: string } | null)?.id) {
    return { error: "Ya estás inscrito en esta convocatoria." };
  }

  const payload = {
    user_id: user.id,
    program_schedule_id: scheduleId,
    tenant_id: tenantId ?? null,
    status: "enrolled",
    payment_status: "pending",
  } satisfies Tables["enrollment"]["Insert"];

  const { error } = await supabase.from("enrollment").insert(payload as never);
  if (error) return { error: error.message };

  revalidatePath("/user/catalogo");
  revalidatePath("/user/cursos");
  return { ok: true };
}

export type ObjectiveResult = { error?: string; ok?: boolean };

export async function declareObjective(
  values: DeclareObjectiveInput,
): Promise<ObjectiveResult> {
  const parsed = declareObjectiveSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const v = parsed.data;

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión expirada" };

  const payload = {
    user_id: user.id,
    enrollment_id: v.enrollmentId,
    objective_text: v.objectiveText,
    target_date: v.targetDate,
    status: "active",
    progress_pct: 0,
  } satisfies Tables["user_objective"]["Insert"];

  const insertRes = await supabase
    .from("user_objective")
    .insert(payload as never)
    .select("id")
    .maybeSingle();
  if (insertRes.error) return { error: insertRes.error.message };
  const objectiveId = (insertRes.data as { id: string } | null)?.id;
  if (!objectiveId) return { error: "No se pudo crear el objetivo." };

  const links = v.categoryIds.map((categoryId) => ({
    objective_id: objectiveId,
    category_id: categoryId,
  }));
  const { error: linkErr } = await supabase
    .from("objective_category_link")
    .insert(links as never);
  if (linkErr) return { error: linkErr.message };

  revalidatePath("/user/objetivos");
  return { ok: true };
}

export async function editObjective(
  values: EditObjectiveInput,
): Promise<ObjectiveResult> {
  const parsed = editObjectiveSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const v = parsed.data;

  const supabase = createSupabaseServerClient();

  const { error: updErr } = await supabase
    .from("user_objective")
    .update({
      objective_text: v.objectiveText,
      target_date: v.targetDate,
    } as never)
    .eq("id", v.objectiveId);
  if (updErr) return { error: updErr.message };

  // Reemplazar categorías vinculadas.
  await supabase
    .from("objective_category_link")
    .delete()
    .eq("objective_id", v.objectiveId);
  const links = v.categoryIds.map((categoryId) => ({
    objective_id: v.objectiveId,
    category_id: categoryId,
  }));
  const { error: linkErr } = await supabase
    .from("objective_category_link")
    .insert(links as never);
  if (linkErr) return { error: linkErr.message };

  revalidatePath("/user/objetivos");
  return { ok: true };
}

export type ProgressResult = { error?: string; ok?: boolean };

export async function updateObjectiveProgress(
  _prev: ProgressResult | undefined,
  formData: FormData,
): Promise<ProgressResult> {
  const objectiveId = String(formData.get("objectiveId") ?? "");
  const progress = Number(formData.get("progress") ?? "0");
  const note = String(formData.get("note") ?? "");
  if (!objectiveId) return { error: "Falta el objetivo" };
  const pct = Math.max(0, Math.min(100, Number.isFinite(progress) ? progress : 0));

  const supabase = createSupabaseServerClient();

  const { error: updErr } = await supabase
    .from("user_objective")
    .update({
      progress_pct: pct,
      status: pct >= 100 ? "achieved" : "in_progress",
      ...(pct >= 100 ? { achieved_at: new Date().toISOString() } : {}),
    } as never)
    .eq("id", objectiveId);
  if (updErr) return { error: updErr.message };

  const { error: insErr } = await supabase.from("objective_update").insert({
    objective_id: objectiveId,
    progress_pct: pct,
    note: note || null,
    source: "student",
  } as never);
  if (insErr) return { error: insErr.message };

  revalidatePath("/user/objetivos");
  return { ok: true };
}

export type AchieveResult = { error?: string; ok?: boolean };

export async function markObjectiveAchieved(
  _prev: AchieveResult | undefined,
  formData: FormData,
): Promise<AchieveResult> {
  const objectiveId = String(formData.get("objectiveId") ?? "");
  const note = String(formData.get("note") ?? "");
  if (!objectiveId) return { error: "Falta el objetivo" };

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("user_objective")
    .update({
      status: "achieved",
      progress_pct: 100,
      achieved_at: new Date().toISOString(),
      achievement_note: note || null,
    } as never)
    .eq("id", objectiveId);
  if (error) return { error: error.message };

  await supabase.from("objective_update").insert({
    objective_id: objectiveId,
    progress_pct: 100,
    note: note || "Objetivo logrado 🎉",
    source: "student",
  } as never);

  revalidatePath("/user/objetivos");
  return { ok: true };
}
