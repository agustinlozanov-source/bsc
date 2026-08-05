"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button, Input, Label } from "@bsc/ui";
import {
  scheduleProgram,
  type ScheduleResult,
} from "@/app/(dashboard)/professional/academico/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Guardando…" : "Agregar convocatoria"}
    </Button>
  );
}

export function ScheduleForm({ programId }: { programId: string }) {
  const [state, formAction] = useFormState<ScheduleResult | undefined, FormData>(
    scheduleProgram,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="programId" value={programId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="startDate">Inicio</Label>
          <Input id="startDate" name="startDate" type="datetime-local" required />
        </div>
        <div>
          <Label htmlFor="endDate">Fin (opcional)</Label>
          <Input id="endDate" name="endDate" type="datetime-local" />
        </div>
        <div>
          <Label htmlFor="location">Lugar</Label>
          <Input id="location" name="location" placeholder="Aula principal" />
        </div>
        <div>
          <Label htmlFor="maxParticipants">Cupo</Label>
          <Input id="maxParticipants" name="maxParticipants" inputMode="numeric" />
        </div>
      </div>
      {state?.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}
      {state?.ok ? (
        <p className="text-sm text-brand">Convocatoria agregada.</p>
      ) : null}
      <SubmitButton />
    </form>
  );
}
