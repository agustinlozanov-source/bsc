"use server";

import { revalidatePath } from "next/cache";
import {
  createEnterpriseSchema,
  type CreateEnterpriseInput,
} from "@bsc/validators";
import type { Database } from "@bsc/db/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Tables = Database["public"]["Tables"];

export type EnterpriseResult = { error?: string; ok?: boolean };

export async function createEnterprise(
  values: CreateEnterpriseInput,
): Promise<EnterpriseResult> {
  const parsed = createEnterpriseSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const v = parsed.data;

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión expirada" };

  const roleRes = await supabase
    .from("user_tenant_role")
    .select("tenant_id")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .eq("is_active", true)
    .eq("is_read_only", false)
    .limit(1)
    .maybeSingle();
  const tenantId = (roleRes.data as { tenant_id: string | null } | null)
    ?.tenant_id;
  if (!tenantId) return { error: "No administras ninguna sucursal." };

  const payload = {
    tenant_id: tenantId,
    name: v.name,
    rfc: v.rfc || null,
    sector: v.sector || null,
    size: v.size,
    hr_contact_name: v.hrContactName || null,
    hr_contact_email: v.hrContactEmail || null,
    hr_contact_phone: v.hrContactPhone || null,
    membership_tier: v.membershipTier,
    is_active: true,
  } satisfies Tables["enterprise"]["Insert"];

  const { error } = await supabase.from("enterprise").insert(payload as never);
  if (error) return { error: error.message };

  revalidatePath("/admin/empresas");
  return { ok: true };
}
