import { Card, CardContent, CardHeader, CardTitle } from "@bsc/ui";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { EnterpriseForm } from "@/components/admin/enterprise-form";
import {
  EnterprisesTable,
  type EnterpriseRow,
} from "@/components/admin/enterprises-table";

export default async function AdminEmpresasPage() {
  const ctx = await requireRole("admin");
  const tenantId = ctx.roles.find((r) => r.role === "admin")?.tenant_id ?? null;
  const supabase = createSupabaseServerClient();

  let enterprises: EnterpriseRow[] = [];
  if (tenantId) {
    const res = await supabase
      .from("enterprise")
      .select(
        "id, name, sector, rfc, membership_tier, hr_contact_name, hr_contact_email, hr_contact_phone",
      )
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });
    enterprises = (res.data as EnterpriseRow[] | null) ?? [];
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-brand">
          Empresas
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          Empresas de la sucursal
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nueva empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <EnterpriseForm />
        </CardContent>
      </Card>

      <EnterprisesTable rows={enterprises} />
    </div>
  );
}
