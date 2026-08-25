"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";
import { CtaLink } from "@/components/ui";
import { NAV, SITIO } from "@/lib/content";
import { EASE } from "@/lib/motion";

export function SiteHeader() {
  const [abierto, setAbierto] = useState(false);
  const reduced = useReducedMotion();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[rgba(250,250,248,0.92)] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-[14px] sm:px-8">
        <Link
          href="/"
          aria-label={`${SITIO.nombre} — inicio`}
          className="rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          <Wordmark />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-b-2 border-transparent py-1 text-[12.5px] font-semibold tracking-[0.3px] text-muted-foreground transition-colors duration-150 ease-bsc hover:border-brand hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <CtaLink
            href={`${SITIO.appUrl}/login`}
            variant="secondary"
            className="hidden px-4 py-2 sm:inline-flex"
          >
            Entrar
          </CtaLink>
          <CtaLink
            href={`${SITIO.appUrl}/registro`}
            className="px-4 py-2 text-[13px]"
          >
            Inscribirme
          </CtaLink>

          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:hidden"
          >
            {abierto ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {abierto ? (
          <motion.nav
            id="menu-movil"
            aria-label="Principal (móvil)"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <ul className="mx-auto max-w-[1180px] px-5 py-2 sm:px-8">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setAbierto(false)}
                    className="block border-b border-border py-3 text-sm font-semibold text-brand last:border-b-0"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
