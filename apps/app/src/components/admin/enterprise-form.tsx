"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button, Input, Label } from "@bsc/ui";
import {
  createEnterprise,
  type EnterpriseResult,
} from "@/app/(dashboard)/admin/actions";

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

const SIZES = [
  ["micro", "Micro"],
  ["small", "Pequeña"],
  ["medium", "Mediana"],
  ["large", "Grande"],
  ["enterprise", "Corporativo"],
] as const;

const TIERS = [
  ["starter", "Starter"],
  ["business", "Business"],
  ["enterprise", "Enterprise"],
] as const;

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Guardando…" : "Dar de alta empresa"}
    </Button>
  );
}

export function EnterpriseForm() {
  const [state, formAction] = useFormState<
    EnterpriseResult | undefined,
    FormData
  >(createEnterprise, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Nombre / razón social</Label>
          <Input id="name" name="name" required />
        </div>
        <div>
          <Label htmlFor="rfc">RFC</Label>
          <Input id="rfc" name="rfc" />
        </div>
        <div>
          <Label htmlFor="sector">Sector</Label>
          <Input id="sector" name="sector" />
        </div>
        <div>
          <Label htmlFor="size">Tamaño</Label>
          <select id="size" name="size" className={selectClass} defaultValue="small">
            {SIZES.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="hrContactName">Contacto de RH</Label>
          <Input id="hrContactName" name="hrContactName" />
        </div>
        <div>
          <Label htmlFor="hrContactEmail">Correo de RH</Label>
          <Input id="hrContactEmail" name="hrContactEmail" type="email" />
        </div>
        <div>
          <Label htmlFor="membershipTier">Membresía del portal</Label>
          <select
            id="membershipTier"
            name="membershipTier"
            className={selectClass}
            defaultValue="starter"
          >
            {TIERS.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>
      {state?.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}
      {state?.ok ? (
        <p className="text-sm text-brand">Empresa dada de alta.</p>
      ) : null}
      <Submit />
    </form>
  );
}
