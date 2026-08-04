import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

export type { Database };
export type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase para el navegador (Client Components).
 * Usa la anon key + RLS. Nunca exponer la service_role key aquí.
 *
 * El cliente de servidor (con manejo de cookies vía next/headers) vive en la
 * app, ya que depende del runtime de Next. Ver apps/app/src/lib/supabase.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  return createBrowserClient<Database>(url, anonKey);
}
