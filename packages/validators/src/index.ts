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

// ── Perfil profesional ──────────────────────────────────────────────────────

const optionalUrl = z
  .string()
  .url("URL inválida")
  .optional()
  .or(z.literal(""));

export const academicDegreeSchema = z.object({
  degree: z.string().min(1, "Requerido"),
  institution: z.string().min(1, "Requerido"),
  year: z
    .string()
    .regex(/^\d{0,4}$/, "Año inválido")
    .optional()
    .or(z.literal("")),
});
export type AcademicDegree = z.infer<typeof academicDegreeSchema>;

export const experienceSchema = z.object({
  company: z.string().min(1, "Requerido"),
  role: z.string().min(1, "Requerido"),
  years: z.string().optional().or(z.literal("")),
  current: z.boolean().optional(),
});
export type Experience = z.infer<typeof experienceSchema>;

export const professionalProfileSchema = z.object({
  firstName: z.string().min(2, "Ingresa tu nombre"),
  lastName: z.string().min(2, "Ingresa tu apellido"),
  phone: z.string().optional().or(z.literal("")),
  bio: z.string().max(2000, "Máximo 2000 caracteres").optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  linkedinUrl: optionalUrl,
  instagramUrl: optionalUrl,
  websiteUrl: optionalUrl,
  institutionalEmail: z
    .string()
    .email("Correo inválido")
    .optional()
    .or(z.literal("")),
  publicProfileSlug: z
    .string()
    .regex(/^[a-z0-9-]*$/, "Solo minúsculas, números y guiones")
    .optional()
    .or(z.literal("")),
  specialties: z.array(z.string().min(1)).default([]),
  academicDegrees: z.array(academicDegreeSchema).default([]),
  professionalExperience: z.array(experienceSchema).default([]),
});
export type ProfessionalProfileInput = z.infer<
  typeof professionalProfileSchema
>;

export { z };
