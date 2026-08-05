import { GraduationCap } from "lucide-react";
import { Card, CardContent } from "@bsc/ui";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type UserRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

export default async function AdminAlumnosPage() {
  const ctx = await requireRole("admin");
  const tenantId = ctx.roles.find((r) => r.role === "admin")?.tenant_id ?? null;
  const supabase = createSupabaseServerClient();

  let users: UserRow[] = [];
  if (tenantId) {
    const roleRes = await supabase
      .from("user_tenant_role")
      .select("user_id")
      .eq("tenant_id", tenantId)
      .eq("role", "user")
      .eq("is_active", true);
    const userIds = [
      ...new Set(
        ((roleRes.data as { user_id: string | null }[] | null) ?? [])
          .map((r) => r.user_id)
          .filter((x): x is string => Boolean(x)),
      ),
    ];
    if (userIds.length > 0) {
      const upRes = await supabase
        .from("user_profile")
        .select("id, first_name, last_name, email")
        .in("id", userIds);
      users = (upRes.data as UserRow[] | null) ?? [];
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-brand">
          Alumnos
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          Alumnos de la sucursal
        </h1>
      </div>

      {users.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <GraduationCap className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No hay alumnos registrados todavía.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <Card key={u.id}>
              <CardContent className="flex items-center justify-between gap-4 py-3">
                <p className="font-medium">
                  {`${u.first_name} ${u.last_name}`.trim()}
                </p>
                <span className="text-sm text-muted-foreground">{u.email}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
