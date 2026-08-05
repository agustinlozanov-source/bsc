export type StatusColor = "green" | "yellow" | "red" | "gray";

export type ObjectiveStatus = {
  key: string;
  label: string;
  color: StatusColor;
};

/** Semáforo automático: cruza % de progreso vs % de tiempo consumido. */
export function objectiveStatus(o: {
  status: string | null;
  progress_pct: number | null;
  created_at: string | null;
  target_date: string;
}): ObjectiveStatus {
  if (o.status === "achieved") {
    return { key: "achieved", label: "Logrado", color: "green" };
  }
  const now = Date.now();
  const start = o.created_at ? new Date(o.created_at).getTime() : now;
  const end = new Date(o.target_date).getTime();
  const progress = Number(o.progress_pct ?? 0);
  const total = end - start;
  const timePct = total > 0 ? Math.min(100, ((now - start) / total) * 100) : 100;

  if (now > end) return { key: "expired", label: "Vencido", color: "red" };
  if (timePct > 90 && progress < 50)
    return { key: "risk", label: "En riesgo", color: "red" };
  if (timePct > 70 && progress < 50)
    return { key: "warn", label: "Atención", color: "yellow" };
  return { key: "ontrack", label: "En tiempo", color: "green" };
}

export function daysRemaining(target: string): number {
  return Math.ceil((new Date(target).getTime() - Date.now()) / 86_400_000);
}

export const STATUS_DOT: Record<StatusColor, string> = {
  green: "bg-green-500",
  yellow: "bg-amber-500",
  red: "bg-red-500",
  gray: "bg-gray-400",
};

export const STATUS_TEXT: Record<StatusColor, string> = {
  green: "text-green-600",
  yellow: "text-amber-600",
  red: "text-red-600",
  gray: "text-gray-500",
};
