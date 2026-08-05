"use client";

import { useState, useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import {
  createProgramSchema,
  type CreateProgramInput,
  type SkillLevel,
} from "@bsc/validators";
import { cn } from "@bsc/utils";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
} from "@bsc/ui";
import {
  FORMAT_LABEL,
  MODALITY_LABEL,
  LEVEL_LABEL,
  TIER_LABEL,
} from "@/lib/labels";
import { createProgram } from "@/app/(dashboard)/professional/academico/actions";
import type { SkillOption } from "@/app/(dashboard)/professional/academico/nuevo/page";

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

const LEVELS: SkillLevel[] = ["basic", "intermediate", "advanced", "expert"];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-destructive">{message}</p>;
}

export function CourseForm({ skills }: { skills: SkillOption[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateProgramInput>({
    resolver: zodResolver(createProgramSchema),
    defaultValues: {
      title: "",
      description: "",
      format: "course",
      modality: "presencial",
      durationHours: "",
      numSessions: "",
      entryProfile: "",
      exitProfile: "",
      maxParticipants: "",
      priceMxn: "",
      tier: "tier1",
      isRecordable: false,
      syllabus: [],
      skills: [],
    },
  });

  const syllabus = useFieldArray({ control, name: "syllabus" });
  const selectedSkills = watch("skills");

  function toggleSkill(skillId: string) {
    const idx = selectedSkills.findIndex((s) => s.skillId === skillId);
    if (idx >= 0) {
      setValue(
        "skills",
        selectedSkills.filter((s) => s.skillId !== skillId),
      );
    } else {
      setValue("skills", [
        ...selectedSkills,
        { skillId, targetLevel: "intermediate" },
      ]);
    }
  }

  function setSkillLevel(skillId: string, level: SkillLevel) {
    setValue(
      "skills",
      selectedSkills.map((s) =>
        s.skillId === skillId ? { ...s, targetLevel: level } : s,
      ),
    );
  }

  const onSubmit = handleSubmit((values) => {
    setError(null);
    startTransition(async () => {
      const res = await createProgram(values);
      if (res.error) setError(res.error);
      else router.push("/professional/academico");
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Datos del programa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input id="title" {...register("title")} />
            <FieldError message={errors.title?.message} />
          </div>
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" rows={3} {...register("description")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="format">Formato</Label>
              <select id="format" className={selectClass} {...register("format")}>
                {Object.entries(FORMAT_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="modality">Modalidad</Label>
              <select
                id="modality"
                className={selectClass}
                {...register("modality")}
              >
                {Object.entries(MODALITY_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="durationHours">Horas</Label>
              <Input id="durationHours" {...register("durationHours")} />
              <FieldError message={errors.durationHours?.message} />
            </div>
            <div>
              <Label htmlFor="numSessions">Sesiones</Label>
              <Input id="numSessions" {...register("numSessions")} />
              <FieldError message={errors.numSessions?.message} />
            </div>
            <div>
              <Label htmlFor="maxParticipants">Cupo máx.</Label>
              <Input id="maxParticipants" {...register("maxParticipants")} />
              <FieldError message={errors.maxParticipants?.message} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Perfiles de ingreso y egreso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="entryProfile">Perfil de ingreso</Label>
            <Textarea id="entryProfile" rows={2} {...register("entryProfile")} />
          </div>
          <div>
            <Label htmlFor="exitProfile">Perfil de egreso</Label>
            <Textarea id="exitProfile" rows={2} {...register("exitProfile")} />
          </div>
        </CardContent>
      </Card>

      {/* Temario */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Temario por módulo</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              syllabus.append({ module: "", topics: "", hours: "" })
            }
          >
            <Plus className="size-4" /> Agregar módulo
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {syllabus.fields.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin módulos aún.</p>
          ) : null}
          {syllabus.fields.map((field, i) => (
            <div
              key={field.id}
              className="grid gap-2 sm:grid-cols-[1fr_1.5fr_5rem_auto]"
            >
              <Input
                placeholder="Módulo"
                {...register(`syllabus.${i}.module`)}
              />
              <Input
                placeholder="Temas"
                {...register(`syllabus.${i}.topics`)}
              />
              <Input placeholder="Horas" {...register(`syllabus.${i}.hours`)} />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => syllabus.remove(i)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Habilidades */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Habilidades que desarrolla</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {skills.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay habilidades en el catálogo todavía.
            </p>
          ) : null}
          {skills.map((skill) => {
            const selected = selectedSkills.find(
              (s) => s.skillId === skill.id,
            );
            return (
              <div
                key={skill.id}
                className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
              >
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(selected)}
                    onChange={() => toggleSkill(skill.id)}
                  />
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {skill.category}
                  </span>
                </label>
                {selected ? (
                  <select
                    className={cn(selectClass, "h-8 w-36")}
                    value={selected.targetLevel}
                    onChange={(e) =>
                      setSkillLevel(skill.id, e.target.value as SkillLevel)
                    }
                  >
                    {LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {LEVEL_LABEL[lvl]}
                      </option>
                    ))}
                  </select>
                ) : null}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Comercial */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Esquema comercial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="priceMxn">Precio (MXN)</Label>
              <Input id="priceMxn" {...register("priceMxn")} />
              <FieldError message={errors.priceMxn?.message} />
            </div>
            <div>
              <Label htmlFor="tier">Tier</Label>
              <select id="tier" className={selectClass} {...register("tier")}>
                {Object.entries(TIER_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("isRecordable")} />
            Se graba en aula inteligente (activo digital)
          </label>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creando…" : "Crear curso"}
        </Button>
        {error ? <span className="text-sm text-destructive">{error}</span> : null}
      </div>
    </form>
  );
}
