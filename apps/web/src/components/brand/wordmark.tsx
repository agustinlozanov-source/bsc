import Image from "next/image";
import { cn } from "@bsc/utils";

/**
 * Logotipo oficial de Boston Skilling Center.
 *
 * TODO(marca): los archivos entregados son PNG (1200×500). Pedir la versión
 * vectorial — a tamaños pequeños y en pantallas de alta densidad un SVG se ve
 * mejor y pesa menos.
 */
export function Wordmark({
  className,
  tone = "brand",
}: {
  className?: string;
  /** `brand` sobre fondo claro; `inverse` sobre verde principal. */
  tone?: "brand" | "inverse";
}) {
  return (
    <Image
      src={tone === "brand" ? "/brand/bsc-wordmark.png" : "/brand/bsc-wordmark-blanco.png"}
      alt="Boston Skilling Center"
      width={1200}
      height={500}
      priority
      className={cn("h-auto w-[160px]", className)}
    />
  );
}

/** Monograma BSC — espacios reducidos (favicon, app, avatares). */
export function Monograma({
  className,
  tone = "brand",
}: {
  className?: string;
  tone?: "brand" | "inverse";
}) {
  return (
    <Image
      src={tone === "brand" ? "/brand/bsc-monograma.png" : "/brand/bsc-monograma-blanco.png"}
      alt="BSC"
      width={1000}
      height={700}
      className={cn("h-auto w-16", className)}
    />
  );
}

/**
 * Escudo institucional. Uso exclusivo para sellos, parches y documentos
 * oficiales (plan de negocio §11) — no es el logotipo de navegación.
 */
export function Escudo({
  className,
  tone = "brand",
}: {
  className?: string;
  tone?: "brand" | "inverse";
}) {
  return (
    <Image
      src={tone === "brand" ? "/brand/bsc-escudo.png" : "/brand/bsc-escudo-blanco.png"}
      alt="Escudo institucional de Boston Skilling Center · Est. 2026"
      width={1000}
      height={1000}
      className={cn("h-auto w-24", className)}
    />
  );
}
