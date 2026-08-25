import Image from "next/image";
import Link from "next/link";
import { cn } from "@bsc/utils";

/** Sección de contenido con el ritmo vertical de 76px de la guía. */
export function Section({
  id,
  className,
  children,
  tone = "papel",
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
  /** `velo` para separar bloques sin introducir otro color. */
  tone?: "papel" | "velo" | "blanco";
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-20 border-b border-border py-section",
        tone === "velo" && "border-transparent bg-brand-veil",
        tone === "blanco" && "bg-white",
        className,
      )}
    >
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">{children}</div>
    </section>
  );
}

/** Antetítulo con la regla corta a la izquierda (guía §Layout). */
export function Eyebrow({
  children,
  tone = "brand",
  align = "start",
}: {
  children: React.ReactNode;
  /** `inverse` cuando va sobre verde principal. */
  tone?: "brand" | "inverse";
  align?: "start" | "center";
}) {
  return (
    <p
      className={cn(
        "mb-[14px] flex items-center gap-[10px] text-eyebrow uppercase",
        tone === "brand" ? "text-brand-secondary" : "text-brand-tertiary",
        align === "center" && "justify-center",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-px w-[22px]",
          tone === "brand" ? "bg-brand-secondary" : "bg-brand-tertiary",
        )}
      />
      {children}
    </p>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-h1 text-balance text-brand">{children}</h2>;
}

export function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 max-w-[640px] text-pretty text-[16.5px] leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}

const NIVEL_ESTILO = {
  basico: "bg-brand-veil text-brand-secondary",
  intermedio: "bg-gold-veil text-gold",
  avanzado: "bg-brick-veil text-brick",
} as const;

const NIVEL_LABEL = {
  basico: "Básico",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
} as const;

/** Etiqueta de nivel — píldora 11.5px/700 (guía §07). */
export function LevelTag({ nivel }: { nivel: keyof typeof NIVEL_ESTILO }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[6px] rounded-full px-3 py-[5px] text-[11.5px] font-bold",
        NIVEL_ESTILO[nivel],
      )}
    >
      {NIVEL_LABEL[nivel]}
    </span>
  );
}

/**
 * Botón-enlace. Padding 12/22, radio 3px, 14px peso 700 (guía §07).
 * El verde es siempre el color de acción; los acentos nunca lo sustituyen.
 */
export function CtaLink({
  href,
  variant = "primary",
  className,
  children,
  ...props
}: {
  href: string;
  variant?: "primary" | "secondary" | "inverse";
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Link>, "href">) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-lg border-[1.5px] border-transparent px-[22px] py-3 text-sm font-bold tracking-[0.2px] transition-colors duration-200 ease-bsc focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        variant === "primary" && "bg-brand text-white hover:bg-brand-secondary",
        variant === "secondary" &&
          "border-brand text-brand hover:bg-brand-veil",
        variant === "inverse" &&
          "bg-white text-brand hover:bg-brand-veil focus-visible:outline-white",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

/**
 * Divisor de módulo con la estrella de siete puntas (arte original, guía §05).
 * Uso puntual entre secciones largas, nunca como bullet repetido.
 */
export function StarDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-[14px]", className)}>
      <span className="h-px flex-1 bg-border" />
      <Image
        src="/brand/estrella-divisor.png"
        alt=""
        width={16}
        height={16}
        className="h-4 w-4"
      />
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
