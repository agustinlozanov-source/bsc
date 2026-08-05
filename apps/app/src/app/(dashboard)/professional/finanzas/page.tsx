import { Wallet } from "lucide-react";
import { formatMXN } from "@bsc/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@bsc/ui";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type TxRow = {
  id: string;
  description: string | null;
  type: string | null;
  amount_professional: number | null;
  payment_status: string | null;
  payment_date: string | null;
  created_at: string | null;
};

export default async function FinanzasPage() {
  await requireRole("professional");
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profRes = await supabase
    .from("professional_profile")
    .select("id, membership_tier")
    .eq("user_id", user!.id)
    .maybeSingle();
  const prof = profRes.data as
    | { id: string; membership_tier: string | null }
    | null;

  let txs: TxRow[] = [];
  let totalPaid = 0;
  if (prof) {
    const txRes = await supabase
      .from("financial_transaction")
      .select(
        "id, description, type, amount_professional, payment_status, payment_date, created_at",
      )
      .eq("professional_id", prof.id)
      .order("created_at", { ascending: false });
    txs = (txRes.data as TxRow[] | null) ?? [];
    totalPaid = txs
      .filter((t) => t.payment_status === "paid")
      .reduce((sum, t) => sum + Number(t.amount_professional ?? 0), 0);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-brand">
          Finanzas
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          Estado de cuenta
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ingresos cobrados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMXN(totalPaid)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Membresía
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {prof?.membership_tier ?? "—"}
            </div>
            <CardDescription>Estatus activo</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Movimientos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{txs.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Movimientos</CardTitle>
          <CardDescription>
            Ingresos por cursos, coaching, consultoría y regalías.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {txs.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <Wallet className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Sin movimientos todavía. Aparecerán cuando se registren pagos de
                tus eventos.
              </p>
            </div>
          ) : (
            <ul className="divide-y text-sm">
              {txs.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between py-2"
                >
                  <div>
                    <p className="font-medium">
                      {t.description ?? t.type ?? "Movimiento"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.payment_date
                        ? new Date(t.payment_date).toLocaleDateString("es-MX")
                        : "Pendiente"}
                    </p>
                  </div>
                  <span className="font-medium">
                    {formatMXN(Number(t.amount_professional ?? 0))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
