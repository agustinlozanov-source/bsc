"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import type { ElementType } from "react";
import { fadeUp, stagger, still, VIEWPORT } from "@/lib/motion";

type RevealProps = {
  /** Etiqueta semántica a renderizar (`section`, `article`, `ul`…). */
  as?: ElementType;
  /** Escalona los hijos directos en lugar de animar el bloque completo. */
  group?: boolean;
  /** Retraso extra en segundos, para desfasar bloques hermanos. */
  delay?: number;
} & HTMLMotionProps<"div">;

/**
 * Entrada al hacer scroll. Envuelve cualquier bloque; con `group` escalona a sus
 * hijos, que deben ser `<RevealItem>`. Si el sistema pide movimiento reducido,
 * renderiza el estado final sin animar.
 */
export function Reveal({
  as = "div",
  group = false,
  delay = 0,
  children,
  ...props
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as as "div"];

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={reduced ? still : group ? stagger : fadeUp}
      transition={delay ? { delay } : undefined}
      {...props}
    >
      {children}
    </MotionTag>
  );
}

/** Hijo de un `<Reveal group>`. */
export function RevealItem({
  as = "div",
  children,
  ...props
}: Omit<RevealProps, "group" | "delay">) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as as "div"];

  return (
    <MotionTag variants={reduced ? still : fadeUp} {...props}>
      {children}
    </MotionTag>
  );
}
