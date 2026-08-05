"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@bsc/ui";
import { enrollInSchedule, type EnrollResult } from "@/app/(dashboard)/user/actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Inscribiendo…" : "Inscribirme"}
    </Button>
  );
}

export function EnrollButton({ scheduleId }: { scheduleId: string }) {
  const [state, formAction] = useFormState<EnrollResult | undefined, FormData>(
    enrollInSchedule,
    undefined,
  );

  if (state?.ok) {
    return <span className="text-sm font-medium text-brand">Inscrito ✓</span>;
  }

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="scheduleId" value={scheduleId} />
      <Submit />
      {state?.error ? (
        <p className="text-xs text-destructive">{state.error}</p>
      ) : null}
    </form>
  );
}
