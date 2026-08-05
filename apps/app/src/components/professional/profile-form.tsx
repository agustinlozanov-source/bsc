"use client";

import { useState, useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import {
  professionalProfileSchema,
  type ProfessionalProfileInput,
} from "@bsc/validators";
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
import { updateProfessionalProfile } from "@/app/(dashboard)/professional/perfil/actions";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-destructive">{message}</p>;
}

export function ProfileForm({
  initial,
}: {
  initial: ProfessionalProfileInput;
}) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfessionalProfileInput>({
    resolver: zodResolver(professionalProfileSchema),
    defaultValues: initial,
  });

  const degrees = useFieldArray({ control, name: "academicDegrees" });
  const experience = useFieldArray({ control, name: "professionalExperience" });
  const specialties = watch("specialties");

  const onSubmit = handleSubmit((values) => {
    setFeedback(null);
    startTransition(async () => {
      const res = await updateProfessionalProfile(values);
      if (res.error) setFeedback({ ok: false, text: res.error });
      else setFeedback({ ok: true, text: "Perfil guardado correctamente." });
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Datos personales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Datos personales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">Nombre</Label>
              <Input id="firstName" {...register("firstName")} />
              <FieldError message={errors.firstName?.message} />
            </div>
            <div>
              <Label htmlFor="lastName">Apellido</Label>
              <Input id="lastName" {...register("lastName")} />
              <FieldError message={errors.lastName?.message} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" {...register("phone")} />
            </div>
            <div>
              <Label htmlFor="institutionalEmail">Correo institucional</Label>
              <Input
                id="institutionalEmail"
                type="email"
                placeholder="nombre@bostonskillingcenter.com"
                {...register("institutionalEmail")}
              />
              <FieldError message={errors.institutionalEmail?.message} />
            </div>
          </div>
          <div>
            <Label htmlFor="bio">Resumen ejecutivo / bio</Label>
            <Textarea id="bio" rows={4} {...register("bio")} />
            <FieldError message={errors.bio?.message} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="city">Ciudad</Label>
              <Input id="city" {...register("city")} />
            </div>
            <div>
              <Label htmlFor="state">Estado</Label>
              <Input id="state" {...register("state")} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Especialidades */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Especialidades</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="specialties">
            Áreas de dominio (separadas por coma)
          </Label>
          <Input
            id="specialties"
            defaultValue={specialties.join(", ")}
            placeholder="Liderazgo, Estrategia, Finanzas"
            onChange={(e) =>
              setValue(
                "specialties",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
          />
        </CardContent>
      </Card>

      {/* Formación académica */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Formación académica</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              degrees.append({ degree: "", institution: "", year: "" })
            }
          >
            <Plus className="size-4" /> Agregar
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {degrees.fields.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Sin registros. Agrega tus grados y certificaciones.
            </p>
          ) : null}
          {degrees.fields.map((field, i) => (
            <div key={field.id} className="grid gap-2 sm:grid-cols-[1fr_1fr_5rem_auto]">
              <Input
                placeholder="Grado (ej. Maestría en...)"
                {...register(`academicDegrees.${i}.degree`)}
              />
              <Input
                placeholder="Institución"
                {...register(`academicDegrees.${i}.institution`)}
              />
              <Input
                placeholder="Año"
                {...register(`academicDegrees.${i}.year`)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => degrees.remove(i)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Experiencia profesional */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Experiencia profesional</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              experience.append({
                company: "",
                role: "",
                years: "",
                current: false,
              })
            }
          >
            <Plus className="size-4" /> Agregar
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {experience.fields.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Sin registros. Agrega tu experiencia relevante.
            </p>
          ) : null}
          {experience.fields.map((field, i) => (
            <div
              key={field.id}
              className="grid gap-2 sm:grid-cols-[1fr_1fr_6rem_auto_auto]"
            >
              <Input
                placeholder="Empresa"
                {...register(`professionalExperience.${i}.company`)}
              />
              <Input
                placeholder="Rol"
                {...register(`professionalExperience.${i}.role`)}
              />
              <Input
                placeholder="Años"
                {...register(`professionalExperience.${i}.years`)}
              />
              <label className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  {...register(`professionalExperience.${i}.current`)}
                />
                Actual
              </label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => experience.remove(i)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Redes y perfil público */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Redes y perfil público</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="linkedinUrl">LinkedIn</Label>
              <Input id="linkedinUrl" {...register("linkedinUrl")} />
              <FieldError message={errors.linkedinUrl?.message} />
            </div>
            <div>
              <Label htmlFor="instagramUrl">Instagram</Label>
              <Input id="instagramUrl" {...register("instagramUrl")} />
              <FieldError message={errors.instagramUrl?.message} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="websiteUrl">Sitio web</Label>
              <Input id="websiteUrl" {...register("websiteUrl")} />
              <FieldError message={errors.websiteUrl?.message} />
            </div>
            <div>
              <Label htmlFor="publicProfileSlug">Slug público</Label>
              <Input
                id="publicProfileSlug"
                placeholder="nombre-apellido"
                {...register("publicProfileSlug")}
              />
              <FieldError message={errors.publicProfileSlug?.message} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando…" : "Guardar cambios"}
        </Button>
        {feedback ? (
          <span
            className={
              feedback.ok
                ? "text-sm text-brand"
                : "text-sm text-destructive"
            }
          >
            {feedback.text}
          </span>
        ) : null}
      </div>
    </form>
  );
}
