"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@bsc/ui";
import { signUp, type AuthResult } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Creando cuenta…" : "Crear cuenta"}
    </Button>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useFormState<AuthResult | undefined, FormData>(
    signUp,
    undefined,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear cuenta</CardTitle>
        <CardDescription>
          Regístrate como alumno para empezar tu desarrollo.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">Nombre</Label>
              <Input id="firstName" name="firstName" required minLength={2} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Apellido</Label>
              <Input id="lastName" name="lastName" required minLength={2} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
            />
          </div>
          {state?.error ? (
            <p className="text-sm text-destructive">{state.error}</p>
          ) : null}
          {state?.message ? (
            <p className="text-sm text-brand">{state.message}</p>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <SubmitButton />
          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-medium text-brand hover:underline">
              Inicia sesión
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
