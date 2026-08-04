import type { UserRole } from "@bsc/validators";

/** Prioridad para elegir el rol primario cuando un usuario tiene varios. */
export const ROLE_PRIORITY: readonly UserRole[] = [
  "superadmin",
  "admin",
  "enterprise_admin",
  "professional",
  "user",
] as const;

/** Ruta de dashboard por rol. */
export const ROLE_DASHBOARD: Record<UserRole, string> = {
  superadmin: "/superadmin",
  admin: "/admin",
  enterprise_admin: "/enterprise",
  professional: "/professional",
  user: "/user",
};

/** Etiqueta legible por rol. */
export const ROLE_LABEL: Record<UserRole, string> = {
  superadmin: "Superadmin",
  admin: "Admin de sucursal",
  enterprise_admin: "Empresa",
  professional: "Profesional",
  user: "Alumno",
};

/** Elige el rol de mayor jerarquía de una lista. */
export function pickPrimaryRole(roles: UserRole[]): UserRole | null {
  for (const role of ROLE_PRIORITY) {
    if (roles.includes(role)) return role;
  }
  return null;
}

/** Segmento de URL protegido asociado a cada rol (para validar acceso). */
export const ROLE_SEGMENTS = Object.values(ROLE_DASHBOARD).map((p) =>
  p.replace("/", ""),
);
