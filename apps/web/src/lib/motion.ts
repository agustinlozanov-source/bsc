import type { Variants } from "motion/react";

/**
 * Vocabulario de movimiento del sitio público.
 *
 * La marca es institucional y sobria: el movimiento acompaña la lectura, nunca
 * la protagoniza. Reglas fijas del sistema:
 *  - Desplazamientos cortos (8–16px): se lee como fundido, no como deslizamiento.
 *  - Duración 300–500ms con una única curva (`ease`).
 *  - Stagger de 60ms y nunca más de ~8 hijos encadenados.
 *  - Todo se reduce a estado final inmediato con `prefers-reduced-motion`.
 */

/** Curva única del sistema (coincide con `ease-bsc` del preset de Tailwind). */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** El reveal solo se dispara una vez y a 15% del borde inferior. */
export const VIEWPORT = { once: true, margin: "0px 0px -15% 0px" } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
};

/** Contenedor de listas y grids: escalona a sus hijos directos. */
export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

/** Variante sin movimiento, para `prefers-reduced-motion: reduce`. */
export const still: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};
