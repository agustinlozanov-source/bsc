"use client";

import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { BookOpen } from "lucide-react";
import {
  declareObjectiveSchema,
  type DeclareObjectiveInput,
} from "@bsc/validators";
import {
  Button,
  Combobox,
  MultiCombobox,
  Input,
  Label,
  Textarea,
  type ComboOption,
} from "@bsc/ui";
import { iconByName } from "@/lib/lucide-icon";
import { declareObjective } from "@/app/(dashboard)/user/actions";

function Req() {
  return <span className="text-destructive"> *</span>;
}
function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-destructive">{message}</p>;
}

export function ObjectiveForm({
  enrollments,
  categories,
}: {
  enrollments: { id: string; label: string }[];
  categories: { id: string; name: string; icon: string | null }[];
}) {
  const [isPending, startTransition] = useTransition();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeclareObjectiveInput>({
    resolver: zodResolver(declareObjectiveSchema),
    defaultValues: {
      enrollmentId: "",
      categoryIds: [],
      objectiveText: "",
      targetDate: "",
    },
  });

  if (enrollments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Inscríbete a un curso primero para declarar un objetivo asociado.
      </p>
    );
  }

  const courseOptions: ComboOption[] = enrollments.map((e) => ({
    value: e.id,
    label: e.label,
    icon: <BookOpen className="size-4 text-muted-foreground" />,
  }));

  const categoryOptions: ComboOption[] = categories.map((c) => {
    const Icon = iconByName(c.icon);
    return {
      value: c.id,
      label: c.name,
      icon: <Icon className="size-4 text-muted-foreground" />,
    };
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const res = await declareObjective(values);
      if (res.error) toast.error(res.error);
      else {
        toast.success("Objetivo declarado.");
        reset();
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label>
          Curso vinculado <Req />
        </Label>
        <Controller
          control={control}
          name="enrollmentId"
          render={({ field }) => (
            <Combobox
              options={courseOptions}
              value={field.value}
              onChange={field.onChange}
              placeholder="Busca y elige un curso…"
              searchPlaceholder="Buscar curso…"
            />
          )}
        />
        <ErrorText message={errors.enrollmentId?.message} />
      </div>

      <div>
        <Label>
          Categorías <Req />
        </Label>
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
        <ErrorText message={errors.categoryIds?.message} />
      </div>

      <div>
        <Label htmlFor="objectiveText">
          ¿Qué quieres lograr? <Req />
        </Label>
        <Textarea
          id="objectiveText"
          rows={3}
          placeholder="Ejemplo: Implementar un sistema de IA en mi consultora para atender 3x más clientes sin aumentar el equipo."
          {...register("objectiveText")}
        />
        <ErrorText message={errors.objectiveText?.message} />
      </div>

      <div>
        <Label htmlFor="targetDate">
          ¿Para cuándo? <Req />
        </Label>
        <Input
          id="targetDate"
          type="date"
          className="max-w-xs"
          {...register("targetDate")}
        />
        <ErrorText message={errors.targetDate?.message} />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando…" : "Declarar objetivo →"}
      </Button>
    </form>
  );
}
