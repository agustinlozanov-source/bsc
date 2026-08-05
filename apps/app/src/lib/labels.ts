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
