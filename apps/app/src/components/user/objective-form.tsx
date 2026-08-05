"use client";

import { useFormState, useFormStatus } from "react-dom";
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
      {pending ? "Guardando…" : "Declarar objetivo"}
    </Button>
  );
}

export function ObjectiveForm({
  enrollments,
}: {
  enrollments: { id: string; label: string }[];
}) {
  const [state, formAction] = useFormState<ObjectiveResult | undefined, FormData>(
    declareObjective,
    undefined,
  );

  if (enrollments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Inscríbete a un curso primero para declarar un objetivo asociado.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="enrollmentId">Curso</Label>
        <select id="enrollmentId" name="enrollmentId" className={selectClass}>
          {enrollments.map((e) => (
            <option key={e.id} value={e.id}>
              {e.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="objectiveText">¿Qué quieres lograr?</Label>
        <Textarea
          id="objectiveText"
          name="objectiveText"
          rows={3}
          placeholder="Quiero lograr…"
        />
      </div>
      <div>
        <Label htmlFor="targetDate">¿Para cuándo?</Label>
        <Input id="targetDate" name="targetDate" type="date" />
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
