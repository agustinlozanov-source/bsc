"use server";

import { revalidatePath } from "next/cache";
import {
  createProgramSchema,
  createScheduleSchema,
  TIER_SPLITS,
  type CreateProgramInput,
} from "@bsc/validators";
import type { Database } from "@bsc/db/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Tables = Database["public"]["Tables"];

export type CreateProgramResult = { error?: string; programId?: string };

function toNumber(value: string | undefined): number | null {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export async function createProgram(
  values: CreateProgramInput,
): Promise<CreateProgramResult> {
  const parsed = createProgramSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const v = parsed.data;

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión expirada" };

  const profRes = await supabase
    .from("professional_profile")
    .select("id, tenant_id")
    .eq("user_id", user.id)
    .maybeSingle();
  const prof = profRes.data as { id: string; tenant_id: string | null } | null;
  if (!prof) {
    return { error: "No tienes un perfil profesional activo." };
  }

  const splits = TIER_SPLITS[v.tier];

  const programPayload = {
    tenant_id: prof.tenant_id,
    professional_id: prof.id,
    title: v.title,
    description: v.description || null,
    format: v.format,
    modality: v.modality,
    duration_hours: toNumber(v.durationHours),
    num_sessions: toNumber(v.numSessions),
    syllabus: v.syllabus,
    entry_profile: v.entryProfile || null,
    exit_profile: v.exitProfile || null,
    max_participants: toNumber(v.maxParticipants),
    price_mxn: toNumber(v.priceMxn),
    tier: v.tier,
    split_professional: splits.professional,
    split_center: splits.center,
    is_recordable: v.isRecordable,
    is_published: false,
    is_active: true,
  } satisfies Tables["program"]["Insert"];

  const insertRes = await supabase
    .from("program")
    .insert(programPayload as never)
    .select("id")
    .maybeSingle();
  if (insertRes.error) return { error: insertRes.error.message };
  const programId = (insertRes.data as { id: string } | null)?.id;
  if (!programId) return { error: "No se pudo crear el curso." };

  if (v.skills.length > 0) {
    const skillRows = v.skills.map((s) => ({
      program_id: programId,
      skill_id: s.skillId,
      target_level: s.targetLevel,
    })) satisfies Tables["program_skill"]["Insert"][];
    const { error } = await supabase
      .from("program_skill")
      .insert(skillRows as never);
    if (error) return { error: error.message };
  }

  revalidatePath("/professional/academico");
  return { programId };
}

export async function publishProgram(formData: FormData): Promise<void> {
  const programId = String(formData.get("programId") ?? "");
  const publish = String(formData.get("publish") ?? "") === "1";
  if (!programId) return;

  const supabase = createSupabaseServerClient();
  await supabase
    .from("program")
    .update({ is_published: publish } as never)
    .eq("id", programId);

  revalidatePath(`/professional/academico/${programId}`);
  revalidatePath("/professional/academico");
}

export type ScheduleResult = { error?: string; ok?: boolean };

export async function scheduleProgram(
  _prev: ScheduleResult | undefined,
  formData: FormData,
): Promise<ScheduleResult> {
  const programId = String(formData.get("programId") ?? "");
  if (!programId) return { error: "Falta el curso" };

  const parsed = createScheduleSchema.safeParse({
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    location: formData.get("location"),
    maxParticipants: formData.get("maxParticipants"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const v = parsed.data;

  const start = new Date(v.startDate);
  if (Number.isNaN(start.getTime())) return { error: "Fecha inválida" };
  const end = v.endDate ? new Date(v.endDate) : null;

  const supabase = createSupabaseServerClient();
  const progRes = await supabase
    .from("program")
    .select("tenant_id")
    .eq("id", programId)
    .maybeSingle();
  const tenantId = (progRes.data as { tenant_id: string | null } | null)
    ?.tenant_id;

  const payload = {
    program_id: programId,
    tenant_id: tenantId ?? null,
    start_date: start.toISOString(),
    end_date: end && !Number.isNaN(end.getTime()) ? end.toISOString() : null,
    location: v.location || null,
    status: "scheduled",
    max_participants: v.maxParticipants ? Number(v.maxParticipants) : null,
  } satisfies Tables["program_schedule"]["Insert"];

  const { error } = await supabase
    .from("program_schedule")
    .insert(payload as never);
  if (error) return { error: error.message };

  revalidatePath(`/professional/academico/${programId}`);
  return { ok: true };
}
