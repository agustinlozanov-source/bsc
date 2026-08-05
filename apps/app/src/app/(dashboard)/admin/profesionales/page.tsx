import { Users } from "lucide-react";
import { Card, CardContent } from "@bsc/ui";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProfRow = {
  id: string;
  user_id: string | null;
  membership_tier: string | null;
  performance_score: number | null;
};

export default async function AdminProfesionalesPage() {
  const ctx = await requireRole("admin");
  const tenantId = ctx.roles.find((r) => r.role === "admin")?.tenant_id ?? null;
  const supabase = createSupabaseServerClient();

  let profs: ProfRow[] = [];
  const nameByUser = new Map<string, string>();
  if (tenantId) {
    const res = await supabase
      .from("professional_profile")
      .select("id, user_id, membership_tier, performance_score")
      .eq("tenant_id", tenantId)
      .eq("is_active", true);
    profs = (res.data as ProfRow[] | null) ?? [];
    const userIds = profs
      .map((p) => p.user_id)
      .filter((x): x is string => Boolean(x));
    if (userIds.length > 0) {
      const upRes = await supabase
        .from("user_profile")
        .select("id, first_name, last_name")
        .in("id", userIds);
      (
        (upRes.data as
          | { id: string; first_name: string; last_name: string }[]
          | null) ?? []
      ).forEach((u) =>
        nameByUser.set(u.id, `${u.first_name} ${u.last_name}`.trim()),
      );
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-brand">
          Profesionales
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          Red de profesionales
        </h1>
      </div>

      {profs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <Users className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No hay profesionales en esta sucursal.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {profs.map((p) => (
            <Card key={p.id}>
              <CardContent className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="font-medium">
                    {(p.user_id && nameByUser.get(p.user_id)) || "Profesional"}
                  </p>
                  <p className="text-sm capitalize text-muted-foreground">
                    {p.membership_tier ?? "—"}
                  </p>
                </div>
                <span className="text-sm">
                  {p.performance_score != null
                    ? `★ ${Number(p.performance_score).toFixed(2)}`
                    : "—"}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
