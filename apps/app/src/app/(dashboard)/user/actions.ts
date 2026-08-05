"use server";

import { revalidatePath } from "next/cache";
import { declareObjectiveSchema } from "@bsc/validators";
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
  _prev: ObjectiveResult | undefined,
  formData: FormData,
): Promise<ObjectiveResult> {
  const parsed = declareObjectiveSchema.safeParse({
    enrollmentId: formData.get("enrollmentId"),
    objectiveText: formData.get("objectiveText"),
    targetDate: formData.get("targetDate"),
  });
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
  } satisfies Tables["user_objective"]["Insert"];

  const { error } = await supabase
    .from("user_objective")
    .insert(payload as never);
  if (error) return { error: error.message };

  revalidatePath("/user/objetivos");
  return { ok: true };
}
