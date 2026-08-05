"use client";

import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  createEnterpriseSchema,
  type CreateEnterpriseInput,
} from "@bsc/validators";
import { Button, Input, Label, PhoneField } from "@bsc/ui";
import { createEnterprise } from "@/app/(dashboard)/admin/actions";

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

const SIZES = [
  ["micro", "Micro"],
  ["small", "Pequeña"],
  ["medium", "Mediana"],
  ["large", "Grande"],
  ["enterprise", "Corporativo"],
] as const;

const TIERS = [
  ["starter", "Starter"],
  ["business", "Business"],
  ["enterprise", "Enterprise"],
] as const;

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-destructive">{message}</p>;
}

function Req() {
  return <span className="text-destructive"> *</span>;
}

export function EnterpriseForm() {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateEnterpriseInput>({
    resolver: zodResolver(createEnterpriseSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      rfc: "",
      sector: "",
      size: "small",
      hrContactName: "",
      hrContactEmail: "",
      hrContactPhone: "",
      membershipTier: "starter",
    },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const res = await createEnterprise(values);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Empresa dada de alta.");
        reset();
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">
            Nombre comercial <Req />
          </Label>
          <Input id="name" {...register("name")} />
          <ErrorText message={errors.name?.message} />
        </div>
        <div>
          <Label htmlFor="rfc">RFC</Label>
          <Input id="rfc" placeholder="ABC123456XYZ" {...register("rfc")} />
          <ErrorText message={errors.rfc?.message} />
        </div>
        <div>
          <Label htmlFor="sector">Sector</Label>
          <Input id="sector" {...register("sector")} />
        </div>
        <div>
          <Label htmlFor="size">Tamaño</Label>
          <select id="size" className={selectClass} {...register("size")}>
            {SIZES.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="hrContactName">Contacto de RH</Label>
          <Input id="hrContactName" {...register("hrContactName")} />
        </div>
        <div>
          <Label htmlFor="hrContactEmail">Correo de RH</Label>
          <Input
            id="hrContactEmail"
            type="email"
            {...register("hrContactEmail")}
          />
          <ErrorText message={errors.hrContactEmail?.message} />
        </div>
        <div>
          <Label htmlFor="hrContactPhone">Teléfono de RH</Label>
          <Controller
            control={control}
            name="hrContactPhone"
            render={({ field }) => (
              <PhoneField
                id="hrContactPhone"
                value={field.value || undefined}
                onChange={(v) => field.onChange(v ?? "")}
              />
            )}
          />
        </div>
        <div>
          <Label htmlFor="membershipTier">Membresía del portal</Label>
          <select
            id="membershipTier"
            className={selectClass}
            {...register("membershipTier")}
          >
            {TIERS.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Button type="submit" disabled={isPending || !isValid}>
        {isPending ? "Guardando…" : "Dar de alta empresa"}
      </Button>
    </form>
  );
}
