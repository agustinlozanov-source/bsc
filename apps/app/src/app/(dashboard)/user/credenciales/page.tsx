import Link from "next/link";
import { Award } from "lucide-react";
import { buttonVariants, Card, CardContent } from "@bsc/ui";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type CredentialRow = {
  id: string;
  credential_id: string;
  issued_at: string | null;
  badge_template_id: string | null;
  is_revoked: boolean | null;
};

export default async function CredencialesPage() {
  await requireRole("user");
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const credRes = await supabase
    .from("credential_issued")
    .select("id, credential_id, issued_at, badge_template_id, is_revoked")
    .eq("user_id", user!.id)
    .order("issued_at", { ascending: false });
  const credentials = (credRes.data as CredentialRow[] | null) ?? [];

  const badgeName = new Map<string, string>();
  const templateIds = [
    ...new Set(
      credentials
        .map((c) => c.badge_template_id)
        .filter((x): x is string => Boolean(x)),
    ),
  ];
  if (templateIds.length > 0) {
    const btRes = await supabase
      .from("badge_template")
      .select("id, name")
      .in("id", templateIds);
    (btRes.data as { id: string; name: string }[] | null)?.forEach((b) =>
      badgeName.set(b.id, b.name),
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-brand">
          Credenciales
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          Mis insignias
        </h1>
        <p className="mt-1 text-muted-foreground">
          Credenciales verificables emitidas por el centro.
        </p>
      </div>

      {credentials.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Award className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Aún no tienes credenciales. Se emiten al completar un programa.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {credentials.map((c) => (
            <Card key={c.id}>
              <CardContent className="space-y-2 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                    <Award className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {(c.badge_template_id &&
                        badgeName.get(c.badge_template_id)) ||
                        "Credencial BSC"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {c.credential_id}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Emitida:{" "}
                  {c.issued_at
                    ? new Date(c.issued_at).toLocaleDateString("es-MX", {
                        dateStyle: "medium",
                      })
                    : "—"}
                  {c.is_revoked ? " · Revocada" : ""}
                </p>
                <Link
                  href={`/verify/${c.credential_id}`}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Verificar
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
