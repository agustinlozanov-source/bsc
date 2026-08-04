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
import { signIn, type AuthResult } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Entrando…" : "Entrar"}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState<AuthResult | undefined, FormData>(
    signIn,
    undefined,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Iniciar sesión</CardTitle>
        <CardDescription>Accede con tu correo y contraseña.</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="tucorreo@ejemplo.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
            />
          </div>
          {state?.error ? (
            <p className="text-sm text-destructive">{state.error}</p>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <SubmitButton />
          <p className="text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link href="/registro" className="font-medium text-brand hover:underline">
              Regístrate
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
