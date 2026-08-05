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

// ── Programa / curso ────────────────────────────────────────────────────────

export const formatTypeSchema = z.enum([
  "conference",
  "workshop",
  "course",
  "diploma",
  "coaching",
  "consultancy",
]);
export type FormatType = z.infer<typeof formatTypeSchema>;

export const modalityTypeSchema = z.enum(["presencial", "online", "hybrid"]);
export type ModalityType = z.infer<typeof modalityTypeSchema>;

export const skillLevelSchema = z.enum([
  "basic",
  "intermediate",
  "advanced",
  "expert",
]);
export type SkillLevel = z.infer<typeof skillLevelSchema>;

export const programTierSchema = z.enum(["tier1", "tier2"]);
export type ProgramTier = z.infer<typeof programTierSchema>;

export const syllabusModuleSchema = z.object({
  module: z.string().min(1, "Requerido"),
  topics: z.string().optional().or(z.literal("")),
  hours: z
    .string()
    .regex(/^\d*\.?\d*$/, "Número inválido")
    .optional()
    .or(z.literal("")),
});
export type SyllabusModule = z.infer<typeof syllabusModuleSchema>;

export const programSkillInputSchema = z.object({
  skillId: z.string().uuid(),
  targetLevel: skillLevelSchema,
});
export type ProgramSkillInput = z.infer<typeof programSkillInputSchema>;

const optionalNumericText = z
  .string()
  .regex(/^\d*\.?\d*$/, "Número inválido")
  .optional()
  .or(z.literal(""));

export const createProgramSchema = z.object({
  title: z.string().min(3, "Mínimo 3 caracteres"),
  description: z.string().optional().or(z.literal("")),
  format: formatTypeSchema,
  modality: modalityTypeSchema,
  durationHours: optionalNumericText,
  numSessions: optionalNumericText,
  entryProfile: z.string().optional().or(z.literal("")),
  exitProfile: z.string().optional().or(z.literal("")),
  maxParticipants: optionalNumericText,
  priceMxn: optionalNumericText,
  tier: programTierSchema,
  isRecordable: z.boolean().default(false),
  syllabus: z.array(syllabusModuleSchema).default([]),
  skills: z.array(programSkillInputSchema).default([]),
});
export type CreateProgramInput = z.infer<typeof createProgramSchema>;

export const createScheduleSchema = z.object({
  startDate: z.string().min(1, "Requerido"),
  endDate: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  maxParticipants: optionalNumericText,
});
export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;

export const declareObjectiveSchema = z.object({
  enrollmentId: z.string().uuid("Selecciona un curso"),
  objectiveText: z.string().min(5, "Describe tu objetivo"),
  targetDate: z.string().min(1, "Elige una fecha"),
});
export type DeclareObjectiveInput = z.infer<typeof declareObjectiveSchema>;

/** Splits profesional/centro según el tier (regla de negocio BSC). */
export const TIER_SPLITS: Record<
  ProgramTier,
  { professional: number; center: number }
> = {
  tier1: { professional: 0.8, center: 0.2 },
  tier2: { professional: 0.65, center: 0.35 },
};

export { z };
