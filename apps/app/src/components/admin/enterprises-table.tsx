"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { DataTable, QuickView, Card, CardContent, type Column } from "@bsc/ui";

export type EnterpriseRow = {
  id: string;
  name: string;
  sector: string | null;
  rfc: string | null;
  membership_tier: string | null;
  hr_contact_name: string | null;
  hr_contact_email: string | null;
  hr_contact_phone: string | null;
};

export function EnterprisesTable({ rows }: { rows: EnterpriseRow[] }) {
  const [selected, setSelected] = useState<EnterpriseRow | null>(null);

  const columns: Column<EnterpriseRow>[] = [
    {
      key: "name",
      header: "Nombre",
      sortable: true,
      value: (r) => r.name,
      render: (r) => <span className="font-medium">{r.name}</span>,
    },
    {
      key: "sector",
      header: "Sector",
      value: (r) => r.sector ?? "",
      render: (r) => r.sector ?? "—",
    },
    {
      key: "tier",
      header: "Membresía",
      sortable: true,
      value: (r) => r.membership_tier ?? "",
      render: (r) => (
        <span className="capitalize">{r.membership_tier ?? "—"}</span>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={rows}
        columns={columns}
        getRowId={(r) => r.id}
        searchText={(r) => `${r.name} ${r.sector ?? ""}`}
        searchPlaceholder="Buscar empresa…"
        emptyLabel="Aún no hay empresas."
        renderCard={(r) => (
          <Card
            className="cursor-pointer transition-colors hover:border-primary/40"
            onClick={() => setSelected(r)}
          >
            <CardContent className="py-4">
              <p className="font-medium">{r.name}</p>
              <p className="text-sm text-muted-foreground">{r.sector ?? "—"}</p>
              <span className="mt-2 inline-block rounded-full bg-muted px-2 py-0.5 text-xs capitalize text-muted-foreground">
                {r.membership_tier ?? "—"}
              </span>
            </CardContent>
          </Card>
        )}
        rowActions={(r) => (
          <button
            type="button"
            onClick={() => setSelected(r)}
            className="rounded p-1.5 text-muted-foreground hover:bg-muted"
            aria-label="Vista rápida"
          >
            <Eye className="size-4" />
          </button>
        )}
      />

      <QuickView
        open={selected !== null}
        onOpenChange={(o) => {
          if (!o) setSelected(null);
        }}
        title={selected?.name ?? ""}
      >
        {selected ? (
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Sector</dt>
              <dd className="font-medium">{selected.sector ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">RFC</dt>
              <dd className="font-medium">{selected.rfc ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Membresía</dt>
              <dd className="font-medium capitalize">
                {selected.membership_tier ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Contacto de RH</dt>
              <dd className="font-medium">{selected.hr_contact_name ?? "—"}</dd>
              <dd className="text-muted-foreground">
                {selected.hr_contact_email ?? ""}
                {selected.hr_contact_phone
                  ? ` · ${selected.hr_contact_phone}`
                  : ""}
              </dd>
            </div>
          </dl>
        ) : null}
      </QuickView>
    </>
  );
}
