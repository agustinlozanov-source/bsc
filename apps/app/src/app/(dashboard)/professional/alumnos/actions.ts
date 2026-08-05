"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CompleteResult = { error?: string; credentialId?: string };

export async function completeAndIssue(
  _prev: CompleteResult | undefined,
  formData: FormData,
): Promise<CompleteResult> {
  const enrollmentId = String(formData.get("enrollmentId") ?? "");
  if (!enrollmentId) return { error: "Falta la inscripción" };

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.rpc("complete_and_issue", {
    p_enrollment_id: enrollmentId,
  } as never);
  if (error) return { error: error.message };

  revalidatePath("/professional/alumnos");
  return { credentialId: data as string };
}
