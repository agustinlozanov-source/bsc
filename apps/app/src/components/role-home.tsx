import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@bsc/ui";
import type { UserContext } from "@/lib/auth";
import { ROLE_LABEL } from "@/lib/roles";

/**
 * Home genérico de dashboard por rol. Placeholder de Fase 2: confirma sesión,
 * rol y tenant. Los widgets reales llegan en las fases de cada perfil.
 */
export function RoleHome({
  ctx,
  intro,
}: {
  ctx: UserContext;
  intro: string;
}) {
  const role = ctx.primaryRole!;
  const firstName = ctx.profile?.first_name ?? ctx.user.email;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-brand">
          {ROLE_LABEL[role]}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          Hola, {firstName}
        </h1>
        <p className="mt-1 text-muted-foreground">{intro}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sesión</CardTitle>
            <CardDescription>Autenticación verificada</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {ctx.user.email}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Roles</CardTitle>
            <CardDescription>Asignados en la red</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {ctx.roles.map((r) => ROLE_LABEL[r.role]).join(", ") || "—"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sucursales</CardTitle>
            <CardDescription>Tenants con acceso</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {new Set(ctx.roles.map((r) => r.tenant_id).filter(Boolean)).size ||
              0}{" "}
            con acceso
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
