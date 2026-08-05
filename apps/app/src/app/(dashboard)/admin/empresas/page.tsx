import { Building2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@bsc/ui";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { EnterpriseForm } from "@/components/admin/enterprise-form";

type EnterpriseRow = {
  id: string;
  name: string;
  sector: string | null;
  membership_tier: string | null;
  is_active: boolean | null;
};

export default async function AdminEmpresasPage() {
  const ctx = await requireRole("admin");
  const tenantId = ctx.roles.find((r) => r.role === "admin")?.tenant_id ?? null;
  const supabase = createSupabaseServerClient();

  let enterprises: EnterpriseRow[] = [];
  if (tenantId) {
    const res = await supabase
      .from("enterprise")
      .select("id, name, sector, membership_tier, is_active")
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

      {enterprises.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <Building2 className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Aún no hay empresas registradas.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {enterprises.map((e) => (
            <Card key={e.id}>
              <CardContent className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="font-medium">{e.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {e.sector ?? "—"}
                  </p>
                </div>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium capitalize text-muted-foreground">
                  {e.membership_tier ?? "—"}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
