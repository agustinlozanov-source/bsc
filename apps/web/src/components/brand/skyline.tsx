/**
 * Motivo gráfico institucional: skyline y puente de Boston en línea (guía §05).
 *
 * Se usa siempre como textura anclada a una esquina, al 12–18% de opacidad, y
 * nunca como elemento protagonista ni centrado sobre el contenido.
 */
export function Skyline({
  className,
  stroke = "currentColor",
}: {
  className?: string;
  stroke?: string;
}) {
  return (
    <svg
      viewBox="0 0 480 140"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g
        stroke={stroke}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M60 140 L60 100 L80 100 L80 80 L100 80 L100 140" />
        <path d="M110 140 L110 60 L132 60 L132 140" />
        <path d="M140 140 L140 90 L164 90 L164 140" />
        <path d="M172 140 L172 45 L196 45 L196 140" />
        <path d="M204 140 L204 100 L226 100 L226 140" />
        <path d="M234 140 L234 70 L254 70 L254 140" />
        <path d="M262 140 L262 110 L286 110 L286 140" />
        <path d="M180 90 Q 240 55 300 90" />
        <line x1="240" y1="55" x2="240" y2="20" />
      </g>
    </svg>
  );
}
