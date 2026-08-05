"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@bsc/ui";
import {
  completeAndIssue,
  type CompleteResult,
} from "@/app/(dashboard)/professional/alumnos/actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" variant="outline" disabled={pending}>
      {pending ? "Emitiendo…" : "Completar y emitir"}
    </Button>
  );
}

export function CompleteButton({ enrollmentId }: { enrollmentId: string }) {
  const [state, formAction] = useFormState<CompleteResult | undefined, FormData>(
    completeAndIssue,
    undefined,
  );

  if (state?.credentialId) {
    return (
      <span className="text-xs font-medium text-brand">
        Credencial {state.credentialId}
      </span>
    );
  }

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="enrollmentId" value={enrollmentId} />
      <Submit />
      {state?.error ? (
        <p className="text-xs text-destructive">{state.error}</p>
      ) : null}
    </form>
  );
}
