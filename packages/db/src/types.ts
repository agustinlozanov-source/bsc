/**
 * Tipos generados de la base de datos.
 *
 * Placeholder hasta la Fase 1. Se regenera con:
 *   pnpm --filter @bsc/db gen:types
 * (requiere `supabase link` al proyecto).
 */
export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role:
        | "superadmin"
        | "admin"
        | "professional"
        | "user"
        | "enterprise_admin";
    };
  };
};
