"use client";

import { motion, useReducedMotion } from "motion/react";
import { Skyline } from "@/components/brand/skyline";
import { GradientWave } from "@/components/ui/gradient-wave";
import { EASE } from "@/lib/motion";

/**
 * Cuatro tonos del verde institucional. Ninguno más claro que el verde medio:
 * el texto va en blanco y el contraste no debe bajar de 6.5:1 en ningún punto
 * de la onda (guía §Reglas de uso — contraste de texto).
 */
const ONDA = ["#18490e", "#123a0b", "#2d6b1e", "#1f5a14"];

/**
 * Cabecera de portada (guía §07 — "Cabecera de portada").
 *
 * Caja de verde principal con esquinas de 32px y una "cola" inferior de 150×69px
 * (proporción 2.2:1 fija) centrada horizontalmente. El alto total no es fijo: se
 * ajusta al contenido de cada página. El chevron baja con scroll suave a la
 * primera sección, y debajo de la cola se deja ≥80px de aire.
 */
export function CoverHeader({
  eyebrow,
  title,
  lead,
  /** id del elemento al que baja el chevron. */
  scrollTo,
  /**
   * Ilustración opcional a la derecha del titular. Solo aparece a partir de
   * `xl`: por debajo de 1280px el titular se parte en demasiadas líneas y el
   * CTA se sale del primer pantallazo.
   */
  media,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  scrollTo: string;
  media?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const reduced = useReducedMotion();

  function handleChevron() {
    document.getElementById(scrollTo)?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    // pb-32 + mb-24 reservan el aire de salida bajo la cola.
    <header className="px-5 pt-4 sm:px-8">
      <div className="relative mx-auto max-w-[1180px] overflow-visible rounded-cover bg-brand px-6 pb-14 pt-14 text-white sm:px-12 sm:pb-16 sm:pt-20">
        {/*
          La onda se recorta al radio de la caja con su propio contenedor: el
          bloque exterior necesita `overflow-visible` para que la cola sobresalga.
          Sobre ella queda el fondo sólido si WebGL falla o si el sistema pide
          movimiento reducido.
        */}
        <div className="absolute inset-0 overflow-hidden rounded-cover">
          {/*
            `noiseSpeed` por defecto (0.00001) tarda casi medio minuto en mover
            algo perceptible. A 0.00004 la onda deriva de forma lenta pero viva,
            sin llamar la atención sobre sí misma.
          */}
          <GradientWave
            colors={ONDA}
            noiseSpeed={0.00004}
            deform={{ incline: 0.35, noiseAmp: 140, noiseFlow: 4 }}
          />
          {/*
            La cola inferior es un SVG de color sólido. Sin esto, la onda llega
            al borde con un verde distinto y la unión se nota. Este degradado
            hace que los últimos 140px converjan al verde principal exacto.
          */}
          <div className="absolute inset-x-0 bottom-0 h-[140px] bg-gradient-to-b from-transparent to-brand" />
        </div>

        {/* Motivo anclado a la esquina inferior derecha, nunca al centro. */}
        <Skyline className="bsc-motivo bottom-0 right-0 hidden h-[180px] w-auto text-white sm:block" />

        <div
          className={
            media
              ? "relative z-10 grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,520px)]"
              : "relative z-10"
          }
        >
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="max-w-2xl"
          >
            {eyebrow ? (
              <p className="mb-4 flex items-center gap-[10px] text-eyebrow uppercase text-brand-tertiary">
                <span
                  aria-hidden="true"
                  className="h-px w-[22px] bg-brand-tertiary"
                />
                {eyebrow}
              </p>
            ) : null}

            <h1 className="text-display text-balance">{title}</h1>

            {lead ? (
              <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-brand-veil">
                {lead}
              </p>
            ) : null}

            {children ? <div className="mt-8">{children}</div> : null}
          </motion.div>

          {media ? (
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: reduced ? 0 : 0.12 }}
              className="hidden xl:-mt-6 xl:block"
            >
              {media}
            </motion.div>
          ) : null}
        </div>

        {/* Cola: 150px de ancho, proporción 2.2:1, centrada. */}
        <svg
          viewBox="0 0 240 110"
          preserveAspectRatio="xMidYMin meet"
          aria-hidden="true"
          className="absolute left-1/2 top-full z-0 block h-auto w-[150px] -translate-x-1/2 -translate-y-[2px] fill-brand"
        >
          <path d="M240,0 Q220,0 205,20 L140,85 Q120,105 100,85 L35,20 Q20,0 0,0 Z" />
        </svg>

        <button
          type="button"
          onClick={handleChevron}
          aria-label="Ir al contenido"
          className="absolute -bottom-[46px] left-1/2 z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full text-white transition-transform duration-200 ease-bsc hover:translate-y-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
    </header>
  );
}
