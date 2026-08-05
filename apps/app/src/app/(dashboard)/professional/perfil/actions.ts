"use server";

import { revalidatePath } from "next/cache";
import {
  professionalProfileSchema,
  type ProfessionalProfileInput,
} from "@bsc/validators";
import type { Database } from "@bsc/db/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Tables = Database["public"]["Tables"];

export type ProfileResult = { error?: string; success?: boolean };

export async function updateProfessionalProfile(
  values: ProfessionalProfileInput,
): Promise<ProfileResult> {
  const parsed = professionalProfileSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const v = parsed.data;

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión expirada" };

  const userPayload = {
    first_name: v.firstName,
    last_name: v.lastName,
    phone: v.phone || null,
    bio: v.bio || null,
    city: v.city || null,
    state: v.state || null,
    linkedin_url: v.linkedinUrl || null,
    instagram_url: v.instagramUrl || null,
    website_url: v.websiteUrl || null,
  } satisfies Tables["user_profile"]["Update"];

  const { error: userErr } = await supabase
    .from("user_profile")
    .update(userPayload as never)
    .eq("id", user.id);
  if (userErr) return { error: userErr.message };

  const profPayload = {
    specialties: v.specialties,
    institutional_email: v.institutionalEmail || null,
    public_profile_slug: v.publicProfileSlug || null,
    academic_degrees: v.academicDegrees,
    professional_experience: v.professionalExperience,
  } satisfies Tables["professional_profile"]["Update"];

  const existingRes = await supabase
    .from("professional_profile")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  const existing = existingRes.data as { id: string } | null;

  if (existing) {
    const { error } = await supabase
      .from("professional_profile")
      .update(profPayload as never)
      .eq("id", existing.id);
    if (error) return { error: error.message };
  } else {
    const roleRes = await supabase
      .from("user_tenant_role")
      .select("tenant_id")
      .eq("user_id", user.id)
      .eq("role", "professional")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();
    const tenantId = (roleRes.data as { tenant_id: string | null } | null)
      ?.tenant_id;
    const insertPayload = {
      user_id: user.id,
      tenant_id: tenantId ?? null,
      ...profPayload,
    } satisfies Tables["professional_profile"]["Insert"];
    const { error } = await supabase
      .from("professional_profile")
      .insert(insertPayload as never);
    if (error) return { error: error.message };
  }

  revalidatePath("/professional/perfil");
  return { success: true };
}
