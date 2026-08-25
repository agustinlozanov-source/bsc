import Image from "next/image";
import { cn } from "@bsc/utils";

/**
 * Recursos gráficos oficiales de BSC.
 *
 * Dos registros distintos, que no se mezclan en la misma superficie:
 *  - `Ilustracion` — línea arquitectónica abstracta (puente, edificios, equipo).
 *    Apoyo puntual: portada, certificado, estado vacío.
 *  - `Personaje` — la familia ilustrada. Siempre sobre blanco o papel, nunca
 *    sobre verde, y máximo uno por pieza.
 *
 * Los SVG se sirven sin pasar por el optimizador (`unoptimized`): ya son
 * vectores y el optimizador de Next rechaza SVG por defecto.
 */

const ILUSTRACIONES = {
  puente: { src: "/brand/ilustracion-puente.svg", alt: "Ilustración del puente de Boston" },
  edificios: { src: "/brand/ilustracion-edificios.svg", alt: "Ilustración de edificios" },
  equipo: { src: "/brand/ilustracion-equipo.svg", alt: "Ilustración de un grupo de personas" },
} as const;

export function Ilustracion({
  nombre,
  className,
  decorativa = true,
}: {
  nombre: keyof typeof ILUSTRACIONES;
  className?: string;
  /** `true` la oculta de lectores de pantalla (acompaña a un texto visible). */
  decorativa?: boolean;
}) {
  const item = ILUSTRACIONES[nombre];
  return (
    <Image
      src={item.src}
      alt={decorativa ? "" : item.alt}
      aria-hidden={decorativa || undefined}
      width={238}
      height={186}
      unoptimized
      className={cn("h-auto w-full", className)}
    />
  );
}

const PERSONAJES = {
  saludo: { src: "/brand/personajes/saludo-chico.svg", alt: "Personaje de Boston Skilling Center saludando", w: 474, h: 480 },
  computadora: { src: "/brand/personajes/computadora-chico.svg", alt: "Personaje trabajando en una computadora", w: 382, h: 497 },
  videollamada: { src: "/brand/personajes/videollamada-chico.svg", alt: "Personaje en una videollamada", w: 382, h: 497 },
  tablet: { src: "/brand/personajes/tablet-chica.svg", alt: "Personaje usando una tableta", w: 382, h: 442 },
  pizarron: { src: "/brand/personajes/pizarron-chica.svg", alt: "Personaje frente a un pizarrón", w: 554, h: 442 },
  libro: { src: "/brand/personajes/libro-chica.svg", alt: "Personaje leyendo un libro", w: 382, h: 442 },
  lapiz: { src: "/brand/personajes/lapiz-chica.svg", alt: "Personaje escribiendo", w: 354, h: 443 },
  lupa: { src: "/brand/personajes/lupa-chica.svg", alt: "Personaje observando con una lupa", w: 382, h: 442 },
  calificacion: { src: "/brand/personajes/calificacion-chico.svg", alt: "Personaje con una calificación alta", w: 382, h: 401 },
  error: { src: "/brand/personajes/error-chico.svg", alt: "Personaje señalando un error", w: 382, h: 497 },
  equipo: { src: "/brand/personajes/equipo.svg", alt: "Dos personajes trabajando en equipo", w: 739, h: 497 },
} as const;

export function Personaje({
  nombre,
  className,
  priority = false,
}: {
  nombre: keyof typeof PERSONAJES;
  className?: string;
  priority?: boolean;
}) {
  const item = PERSONAJES[nombre];
  return (
    <Image
      src={item.src}
      alt={item.alt}
      width={item.w}
      height={item.h}
      priority={priority}
      unoptimized
      className={cn("h-auto w-full", className)}
    />
  );
}
