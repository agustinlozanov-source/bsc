"use client";

import { useMemo, useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Eye,
  Pencil,
  Target,
  Search,
  LayoutList,
  FolderTree,
  Linkedin,
  Twitter,
  Link2,
} from "lucide-react";
import { editObjectiveSchema, type EditObjectiveInput } from "@bsc/validators";
import { cn } from "@bsc/utils";
import {
  Button,
  Card,
  CardContent,
  Input,
  Textarea,
  QuickView,
  MultiCombobox,
  type ComboOption,
} from "@bsc/ui";
import { iconByName } from "@/lib/lucide-icon";
import {
  objectiveStatus,
  daysRemaining,
  STATUS_DOT,
  STATUS_TEXT,
} from "@/lib/objectives";
import {
  updateObjectiveProgress,
  markObjectiveAchieved,
  editObjective,
  type ProgressResult,
  type AchieveResult,
} from "@/app/(dashboard)/user/actions";

export type ObjectiveCategoryRef = {
  id: string;
  name: string;
  icon: string | null;
};

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
  categories: ObjectiveCategoryRef[];
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

function CategoryChips({ categories }: { categories: ObjectiveCategoryRef[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {categories.map((c) => {
        const Icon = iconByName(c.icon);
        return (
          <span
            key={c.id}
            className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs"
          >
            <Icon className="size-3" />
            {c.name}
          </span>
        );
      })}
    </div>
  );
}

function StatusBadge({ o }: { o: ObjectiveItem }) {
  const st = objectiveStatus(o);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium",
        STATUS_TEXT[st.color],
      )}
    >
      <span className={cn("size-2 rounded-full", STATUS_DOT[st.color])} />
      {st.label}
    </span>
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
  const url = typeof window !== "undefined" ? window.location.origin : "";
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

function EditObjectiveForm({
  objective,
  categoryOptions,
  onDone,
}: {
  objective: ObjectiveItem;
  categoryOptions: ComboOption[];
  onDone: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditObjectiveInput>({
    resolver: zodResolver(editObjectiveSchema),
    defaultValues: {
      objectiveId: objective.id,
      categoryIds: objective.categories.map((c) => c.id),
      objectiveText: objective.objective_text,
      targetDate: objective.target_date.slice(0, 10),
    },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const res = await editObjective(values);
      if (res.error) toast.error(res.error);
      else {
        toast.success("Objetivo actualizado.");
        onDone();
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <p className="mb-1 text-sm font-medium">Categorías</p>
        <Controller
          control={control}
          name="categoryIds"
          render={({ field }) => (
            <MultiCombobox
              options={categoryOptions}
              values={field.value}
              onChange={field.onChange}
              placeholder="Elige una o más…"
              searchPlaceholder="Buscar categoría…"
            />
          )}
        />
        {errors.categoryIds ? (
          <p className="mt-1 text-xs text-destructive">
            {errors.categoryIds.message}
          </p>
        ) : null}
      </div>
      <div>
        <p className="mb-1 text-sm font-medium">Objetivo</p>
        <Textarea rows={3} {...register("objectiveText")} />
      </div>
      <div>
        <p className="mb-1 text-sm font-medium">Fecha meta</p>
        <Input type="date" className="max-w-xs" {...register("targetDate")} />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Guardando…" : "Guardar cambios"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onDone}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function ObjectiveRow({
  o,
  onOpen,
}: {
  o: ObjectiveItem;
  onOpen: () => void;
}) {
  const pct = Number(o.progress_pct ?? 0);
  const days = daysRemaining(o.target_date);
  return (
    <div className="flex items-center gap-4 px-3 py-3">
      <div className="min-w-0 flex-1 space-y-1.5">
        <p className="truncate font-medium">{o.objective_text}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{o.courseTitle ?? "—"}</span>
          <StatusBadge o={o} />
          <span>
            {o.status === "achieved"
              ? "Logrado"
              : days >= 0
                ? `${days} días`
                : "Vencido"}
          </span>
        </div>
        <CategoryChips categories={o.categories} />
      </div>
      <div className="hidden w-32 shrink-0 sm:block">
        <ProgressBar pct={pct} />
        <p className="mt-1 text-right text-xs text-muted-foreground">{pct}%</p>
      </div>
      <button
        type="button"
        onClick={onOpen}
        className="shrink-0 rounded p-1.5 text-muted-foreground hover:bg-muted"
        aria-label="Vista rápida"
      >
        <Eye className="size-4" />
      </button>
    </div>
  );
}

export function ObjectivesList({
  objectives,
  allCategories,
}: {
  objectives: ObjectiveItem[];
  allCategories: ObjectiveCategoryRef[];
}) {
  const [selected, setSelected] = useState<ObjectiveItem | null>(null);
  const [editing, setEditing] = useState(false);
  const [query, setQuery] = useState("");
  const [grouped, setGrouped] = useState(false);

  const categoryOptions: ComboOption[] = useMemo(
    () =>
      allCategories.map((c) => {
        const Icon = iconByName(c.icon);
        return {
          value: c.id,
          label: c.name,
          icon: <Icon className="size-4 text-muted-foreground" />,
        };
      }),
    [allCategories],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return objectives;
    return objectives.filter(
      (o) =>
        o.objective_text.toLowerCase().includes(q) ||
        (o.courseTitle ?? "").toLowerCase().includes(q) ||
        o.categories.some((c) => c.name.toLowerCase().includes(q)),
    );
  }, [objectives, query]);

  const groups = useMemo(() => {
    if (!grouped) return null;
    const map = new Map<string, ObjectiveItem[]>();
    for (const o of filtered) {
      const key = o.courseTitle ?? "Sin curso";
      const list = map.get(key) ?? [];
      list.push(o);
      map.set(key, list);
    }
    return [...map.entries()];
  }, [filtered, grouped]);

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

  const openDetail = (o: ObjectiveItem) => {
    setSelected(o);
    setEditing(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[12rem] flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar objetivo, meta o curso…"
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-1 rounded-md border p-0.5">
          <button
            type="button"
            onClick={() => setGrouped(false)}
            className={cn(
              "rounded p-1.5",
              !grouped ? "bg-muted" : "text-muted-foreground",
            )}
            aria-label="Lista"
            title="Lista"
          >
            <LayoutList className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setGrouped(true)}
            className={cn(
              "rounded p-1.5",
              grouped ? "bg-muted" : "text-muted-foreground",
            )}
            aria-label="Agrupar por curso"
            title="Agrupar por curso"
          >
            <FolderTree className="size-4" />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Sin resultados.
        </p>
      ) : grouped && groups ? (
        <div className="space-y-4">
          {groups.map(([course, items]) => (
            <div key={course}>
              <p className="mb-1 px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {course} · {items.length}
              </p>
              <div className="divide-y rounded-md border">
                {items.map((o) => (
                  <ObjectiveRow key={o.id} o={o} onOpen={() => openDetail(o)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y rounded-md border">
          {filtered.map((o) => (
            <ObjectiveRow key={o.id} o={o} onOpen={() => openDetail(o)} />
          ))}
        </div>
      )}

      <QuickView
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null);
            setEditing(false);
          }
        }}
        title={editing ? "Editar objetivo" : "Objetivo"}
      >
        {selected ? (
          editing ? (
            <EditObjectiveForm
              objective={selected}
              categoryOptions={categoryOptions}
              onDone={() => {
                setEditing(false);
                setSelected(null);
              }}
            />
          ) : (
            <div className="space-y-5">
              <div>
                <CategoryChips categories={selected.categories} />
                <p className="mt-2 font-medium">{selected.objective_text}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selected.courseTitle ?? "—"} · Meta:{" "}
                  {new Date(selected.target_date).toLocaleDateString("es-MX", {
                    dateStyle: "medium",
                  })}
                </p>
                <div className="mt-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setEditing(true)}
                  >
                    <Pencil className="size-4" /> Editar
                  </Button>
                </div>
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
                        <p className="text-xs text-muted-foreground">
                          Días rest.
                        </p>
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
                    <p className="mb-2 text-sm font-medium">
                      Actualizar progreso
                    </p>
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
          )
        ) : null}
      </QuickView>
    </div>
  );
}
