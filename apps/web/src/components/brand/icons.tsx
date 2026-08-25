/**
 * Iconografía del sistema (guía §04): grilla 24×24, trazo 1.75 con remates
 * redondeados, un solo color, sin relleno decorativo. No se mezcla con otro set
 * de íconos en las mismas superficies.
 */

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: "false",
} as const;

export function IconCurso({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M4 5c2-1 5-1 7 0v14c-2-1-5-1-7 0z" />
      <path d="M20 5c-2-1-5-1-7 0v14c2-1 5-1 7 0z" />
    </svg>
  );
}

export function IconTaller({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="16" y1="3" x2="16" y2="7" />
    </svg>
  );
}

export function IconConsultoria({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="3.5" y="8" width="17" height="11" rx="1.5" />
      <path d="M8.5 8V6.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V8" />
    </svg>
  );
}

export function IconInstructor({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="12" cy="8.5" r="3.2" />
      <path d="M5 20c1.2-3.5 4-5 7-5s5.8 1.5 7 5" />
    </svg>
  );
}

export function IconCertificado({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="12" cy="9" r="6" />
      <path d="M9 14.5 7.5 21l4.5-2.5 4.5 2.5-1.5-6.5" />
    </svg>
  );
}

export function IconCalendario({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="4" y="4.5" width="16" height="15" rx="2" />
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="8.5" y1="2.5" x2="8.5" y2="6.5" />
      <line x1="15.5" y1="2.5" x2="15.5" y2="6.5" />
      <circle cx="12" cy="14" r="1" />
    </svg>
  );
}
