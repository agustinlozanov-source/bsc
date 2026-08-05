"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { cn } from "@bsc/utils";
import { Button, Input, Label, Textarea } from "@bsc/ui";
import {
  declareObjective,
  type ObjectiveResult,
} from "@/app/(dashboard)/user/actions";

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Guardando…" : "Declarar objetivo →"}
    </Button>
  );
}

export function ObjectiveForm({
  enrollments,
  categories,
}: {
  enrollments: { id: string; label: string }[];
  categories: { id: string; name: string; icon: string | null }[];
}) {
  const [state, formAction] = useFormState<ObjectiveResult | undefined, FormData>(
    declareObjective,
    undefined,
  );
  const [categoryId, setCategoryId] = useState<string>("");

  if (enrollments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Inscríbete a un curso primero para declarar un objetivo asociado.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="categoryId" value={categoryId} />
      <div>
        <Label htmlFor="enrollmentId">
          Curso vinculado <span className="text-destructive">*</span>
        </Label>
        <select id="enrollmentId" name="enrollmentId" className={selectClass}>
          {enrollments.map((e) => (
            <option key={e.id} value={e.id}>
              {e.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>
          Categoría <span className="text-destructive">*</span>
        </Label>
        <div className="mt-1 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategoryId(c.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                categoryId === c.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "hover:bg-muted",
              )}
            >
              {c.icon ? `${c.icon} ` : ""}
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="objectiveText">
          ¿Qué quieres lograr? <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="objectiveText"
          name="objectiveText"
          rows={3}
          placeholder="Ejemplo: Implementar un sistema de IA en mi consultora para atender 3x más clientes sin aumentar el equipo."
        />
      </div>

      <div>
        <Label htmlFor="targetDate">
          ¿Para cuándo? <span className="text-destructive">*</span>
        </Label>
        <Input id="targetDate" name="targetDate" type="date" className="max-w-xs" />
      </div>

      {state?.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}
      {state?.ok ? (
        <p className="text-sm text-brand">Objetivo declarado.</p>
      ) : null}
      <Submit />
    </form>
  );
}
