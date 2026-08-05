import type {
  FormatType,
  ModalityType,
  SkillLevel,
  ProgramTier,
} from "@bsc/validators";

export const FORMAT_LABEL: Record<FormatType, string> = {
  conference: "Conferencia",
  workshop: "Taller",
  course: "Curso",
  diploma: "Diplomado",
  coaching: "Coaching",
  consultancy: "Consultoría",
};

export const MODALITY_LABEL: Record<ModalityType, string> = {
  presencial: "Presencial",
  online: "Online",
  hybrid: "Híbrido",
};

export const LEVEL_LABEL: Record<SkillLevel, string> = {
  basic: "Básico",
  intermediate: "Intermedio",
  advanced: "Avanzado",
  expert: "Experto",
};

export const TIER_LABEL: Record<ProgramTier, string> = {
  tier1: "Tier 1 (80/20)",
  tier2: "Tier 2 (65/35)",
};

export const ENROLLMENT_STATUS_LABEL: Record<string, string> = {
  enrolled: "Inscrito",
  in_progress: "En curso",
  completed: "Completado",
  cancelled: "Cancelado",
  no_show: "No asistió",
};

export const OBJECTIVE_STATUS_LABEL: Record<string, string> = {
  active: "Activo",
  in_progress: "En progreso",
  achieved: "Logrado",
  not_achieved: "No logrado",
  expired: "Expirado",
};
