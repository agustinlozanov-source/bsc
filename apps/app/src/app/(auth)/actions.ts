"use server";

import { redirect } from "next/navigation";
import { loginSchema, registerSchema } from "@bsc/validators";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthResult = { error?: string; message?: string };

export async function signIn(
  _prev: AuthResult | undefined,
  formData: FormData,
): Promise<AuthResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { error: "Correo o contraseña incorrectos" };
  }
  redirect("/");
}

export async function signUp(
  _prev: AuthResult | undefined,
  formData: FormData,
): Promise<AuthResult> {
  const parsed = registerSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Si la confirmación de correo está activa, no hay sesión todavía.
  if (!data.session) {
    return {
      message:
        "Cuenta creada. Revisa tu correo para confirmar y luego inicia sesión.",
    };
  }

  redirect("/");
}

export async function signOut(): Promise<void> {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
