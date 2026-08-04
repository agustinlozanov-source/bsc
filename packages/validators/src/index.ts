import { z } from "zod";

/** Roles del sistema (espeja el enum user_role en Postgres). */
export const userRoleSchema = z.enum([
  "superadmin",
  "admin",
  "professional",
  "user",
  "enterprise_admin",
]);
export type UserRole = z.infer<typeof userRoleSchema>;

/** Credenciales de acceso (login con email + password). */
export const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export { z };
