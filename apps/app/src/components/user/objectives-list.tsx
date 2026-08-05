"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Linkedin, Twitter, Link2, Target } from "lucide-react";
import { cn } from "@bsc/utils";
import {
  Button,
  Card,
  CardContent,
  QuickView,
  Textarea,
} from "@bsc/ui";
import {
  objectiveStatus,
  daysRemaining,
  STATUS_DOT,
  STATUS_TEXT,
} from "@/lib/objectives";
import {
  updateObjectiveProgress,
  markObjectiveAchieved,
  type ProgressResult,
  type AchieveResult,
} from "@/app/(dashboard)/user/actions";

export type ObjectiveUpdate = {
  id: string;
  progress_pct: number | null;
  note: string | null;
  source: string | null;
  created_at: string | null;
};

export type ObjectiveItem = {
  id: string;
  objective_text: string;
  target_date: string;
  status: string | null;
  progress_pct: number | null;
  created_at: string | null;
  achievement_note: string | null;
  categoryName: string | null;
  categoryIcon: string | null;
  courseTitle: string | null;
  updates: ObjectiveUpdate[];
};

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-brand"
        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
      />
    </div>
  );
}

function UpdateProgressForm({
  objectiveId,
  initial,
}: {
  objectiveId: string;
  initial: number;
}) {
  const [state, action] = useFormState<ProgressResult | undefined, FormData>(
    updateObjectiveProgress,
    undefined,
  );
  const [value, setValue] = useState(initial);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="objectiveId" value={objectiveId} />
      <div>
        <div className="mb-1 flex justify-between text-sm">
          <span className="text-muted-foreground">Progreso</span>
          <span className="font-medium">{value}%</span>
        </div>
        <input
          type="range"
          name="progress"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full accent-[color:hsl(var(--primary))]"
        />
      </div>
      <Textarea name="note" rows={2} placeholder="¿Qué ha pasado?" />
      {state?.error ? (
        <p className="text-xs text-destructive">{state.error}</p>
      ) : null}
      <SubmitBtn label="Guardar progreso" />
    </form>
  );
}

function SubmitBtn({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Guardando…" : label}
    </Button>
  );
}

function AchieveForm({ objectiveId }: { objectiveId: string }) {
  const [state, action] = useFormState<AchieveResult | undefined, FormData>(
    markObjectiveAchieved,
    undefined,
  );
  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="objectiveId" value={objectiveId} />
      <Textarea
        name="note"
        rows={2}
        placeholder="Cuéntanos brevemente qué lograste"
      />
      {state?.error ? (
        <p className="text-xs text-destructive">{state.error}</p>
      ) : null}
      <SubmitBtn label="Marcar como logrado 🎉" />
    </form>
  );
}

function ShareSection({ o }: { o: ObjectiveItem }) {
  const url =
    typeof window !== "undefined" ? window.location.origin : "";
  const text = `🎯 Objetivo logrado en Boston Skilling Center\n\n${
    o.achievement_note ?? o.objective_text
  }\n\nPrograma: ${o.courseTitle ?? "BSC"}\n\n#BostonSkillingCenter #DesarrolloProfesional`;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Comparte tu logro</p>
      <div className="flex flex-wrap gap-2">
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            void navigator.clipboard?.writeText(text);
            toast.success("Texto copiado — pégalo en tu publicación");
          }}
          className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
        >
          <Linkedin className="size-4" /> LinkedIn
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
        >
          <Twitter className="size-4" /> X
        </a>
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard?.writeText(url);
            toast.success("Enlace copiado");
          }}
          className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
        >
          <Link2 className="size-4" /> Copiar enlace
        </button>
      </div>
    </div>
  );
}

export function ObjectivesList({ objectives }: { objectives: ObjectiveItem[] }) {
  const [selected, setSelected] = useState<ObjectiveItem | null>(null);

  if (objectives.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <Target className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Aún no has declarado objetivos.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        {objectives.map((o) => {
          const st = objectiveStatus(o);
          const pct = Number(o.progress_pct ?? 0);
          const days = daysRemaining(o.target_date);
          return (
            <Card
              key={o.id}
              className="cursor-pointer transition-colors hover:border-primary/40"
              onClick={() => setSelected(o)}
            >
              <CardContent className="space-y-3 py-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                    {o.categoryIcon ? `${o.categoryIcon} ` : ""}
                    {o.categoryName ?? "Objetivo"}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-medium",
                      STATUS_TEXT[st.color],
                    )}
                  >
                    <span className={cn("size-2 rounded-full", STATUS_DOT[st.color])} />
                    {st.label}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm font-medium">
                  {o.objective_text}
                </p>
                <ProgressBar pct={pct} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{o.courseTitle ?? "—"}</span>
                  <span>
                    {o.status === "achieved"
                      ? "Logrado"
                      : days >= 0
                        ? `${days} días`
                        : "Vencido"}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <QuickView
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        title="Objetivo"
      >
        {selected ? (
          <div className="space-y-5">
            <div>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                {selected.categoryIcon ? `${selected.categoryIcon} ` : ""}
                {selected.categoryName ?? "Objetivo"}
              </span>
              <p className="mt-2 font-medium">{selected.objective_text}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {selected.courseTitle ?? "—"} · Meta:{" "}
                {new Date(selected.target_date).toLocaleDateString("es-MX", {
                  dateStyle: "medium",
                })}
              </p>
            </div>

            {(() => {
              const st = objectiveStatus(selected);
              const pct = Number(selected.progress_pct ?? 0);
              const days = daysRemaining(selected.target_date);
              return (
                <div className="space-y-2">
                  <ProgressBar pct={pct} />
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <p className="font-semibold">{pct}%</p>
                      <p className="text-xs text-muted-foreground">Progreso</p>
                    </div>
                    <div>
                      <p className={cn("font-semibold", STATUS_TEXT[st.color])}>
                        {st.label}
                      </p>
                      <p className="text-xs text-muted-foreground">Estatus</p>
                    </div>
                    <div>
                      <p className="font-semibold">
                        {selected.status === "achieved"
                          ? "—"
                          : days >= 0
                            ? days
                            : 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Días rest.</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {selected.status === "achieved" ? (
              <ShareSection o={selected} />
            ) : (
              <div className="space-y-4 border-t pt-4">
                <div>
                  <p className="mb-2 text-sm font-medium">Actualizar progreso</p>
                  <UpdateProgressForm
                    objectiveId={selected.id}
                    initial={Number(selected.progress_pct ?? 0)}
                  />
                </div>
                <div className="border-t pt-4">
                  <p className="mb-2 text-sm font-medium">¿Ya lo lograste?</p>
                  <AchieveForm objectiveId={selected.id} />
                </div>
              </div>
            )}

            {selected.updates.length > 0 ? (
              <div className="border-t pt-4">
                <p className="mb-2 text-sm font-medium">Historial</p>
                <ol className="space-y-2">
                  {selected.updates.map((u) => (
                    <li key={u.id} className="text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {u.progress_pct != null ? `${u.progress_pct}%` : "—"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {u.created_at
                            ? new Date(u.created_at).toLocaleDateString("es-MX")
                            : ""}
                          {u.source === "ai_agent" ? " · Agente IA" : ""}
                        </span>
                      </div>
                      {u.note ? (
                        <p className="text-muted-foreground">{u.note}</p>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>
        ) : null}
      </QuickView>
    </>
  );
}
