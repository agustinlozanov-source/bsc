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

/** Registro de un nuevo alumno. */
export const registerSchema = z.object({
  firstName: z.string().min(2, "Ingresa tu nombre"),
  lastName: z.string().min(2, "Ingresa tu apellido"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export { z };
