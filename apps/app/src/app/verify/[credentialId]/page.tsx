import { BadgeCheck, ShieldX } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type VerifiedCredential = {
  credential_id: string;
  issued_at: string | null;
  is_revoked: boolean | null;
  badge_name: string | null;
  badge_description: string | null;
  criteria: string | null;
  hours_required: number | null;
  recipient_name: string | null;
  issuer: string | null;
};

export default async function VerifyPage({
  params,
}: {
  params: { credentialId: string };
}) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.rpc("verify_credential", {
    p_credential_id: params.credentialId,
  } as never);
  const credential = data as VerifiedCredential | null;

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-6 px-6 py-12">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-brand">
          Boston Skilling Center
        </p>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-brand">
          Verificación de credencial
        </h1>
      </div>

      {!credential ? (
        <div className="w-full rounded-xl border bg-card p-8 text-center shadow">
          <ShieldX className="mx-auto size-10 text-destructive" />
          <p className="mt-3 font-medium">Credencial no encontrada</p>
          <p className="mt-1 text-sm text-muted-foreground">
            El identificador <span className="font-mono">{params.credentialId}</span>{" "}
            no corresponde a ninguna credencial emitida.
          </p>
        </div>
      ) : (
        <div className="w-full rounded-xl border bg-card p-8 shadow">
          <div className="flex items-center gap-3">
            <div
              className={
                credential.is_revoked
                  ? "flex size-12 items-center justify-center rounded-full bg-destructive/10"
                  : "flex size-12 items-center justify-center rounded-full bg-primary/10"
              }
            >
              {credential.is_revoked ? (
                <ShieldX className="size-6 text-destructive" />
              ) : (
                <BadgeCheck className="size-6 text-primary" />
              )}
            </div>
            <div>
              <p className="font-semibold">
                {credential.badge_name ?? "Credencial BSC"}
              </p>
              <p className="text-sm text-muted-foreground">
                {credential.is_revoked
                  ? "Credencial revocada"
                  : "Credencial válida"}
              </p>
            </div>
          </div>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Otorgada a</dt>
              <dd className="font-medium">{credential.recipient_name ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Emisor</dt>
              <dd className="font-medium">{credential.issuer ?? "BSC"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Fecha de emisión</dt>
              <dd className="font-medium">
                {credential.issued_at
                  ? new Date(credential.issued_at).toLocaleDateString("es-MX", {
                      dateStyle: "long",
                    })
                  : "—"}
              </dd>
            </div>
            {credential.hours_required != null ? (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Horas</dt>
                <dd className="font-medium">{credential.hours_required}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">ID</dt>
              <dd className="font-mono text-xs">{credential.credential_id}</dd>
            </div>
          </dl>

          {credential.criteria ? (
            <p className="mt-6 border-t pt-4 text-sm text-muted-foreground">
              {credential.criteria}
            </p>
          ) : null}
        </div>
      )}
    </main>
  );
}
