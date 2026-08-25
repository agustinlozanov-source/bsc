import type { Metadata } from "next";
import { CoverHeader } from "@/components/cover-header";
import { Reveal, RevealItem } from "@/components/reveal";
import {
  CtaLink,
  Eyebrow,
  Lead,
  Section,
  SectionTitle,
  StarDivider,
} from "@/components/ui";
import { Ilustracion, Personaje } from "@/components/brand/illustrations";
import { NOSOTROS, SITIO } from "@/lib/content";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Quiénes somos, cómo enseñamos y dónde estamos: la sede de Boston Skilling Center en Reynosa, Tamaulipas.",
};

export default function NosotrosPage() {
  return (
    <>
      <CoverHeader
        eyebrow="Nosotros"
        title="Un centro presencial, en Reynosa"
        lead={NOSOTROS.intro}
        scrollTo="quienes"
      />

      {/* Quiénes somos */}
      <Section id="quienes" tone="papel" className="pt-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_300px] lg:items-start">
          <div>
            <Reveal>
              <Eyebrow>01 — El centro</Eyebrow>
              <SectionTitle>Formación que se sostiene en la práctica</SectionTitle>
            </Reveal>

            <Reveal group className="mt-10 space-y-8">
              {NOSOTROS.bloques.map((bloque) => (
                <RevealItem key={bloque.titulo} as="article">
                  <h3 className="text-h3 text-brand">{bloque.titulo}</h3>
                  <p className="mt-2 max-w-[620px] text-pretty text-[15px] leading-relaxed text-muted-foreground">
                    {bloque.texto}
                  </p>
                </RevealItem>
              ))}
            </Reveal>
          </div>

          {/* El personaje se reserva a bienvenida y va sobre blanco (guía §06). */}
          <Reveal
            delay={0.1}
            className="mx-auto w-full max-w-[300px] rounded-card border border-border bg-white p-6 text-center"
          >
            <Personaje nombre="saludo" className="mx-auto w-[170px]" priority />
            <p className="mt-4 text-[13px] font-bold text-brand">Bienvenido</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[#888888]">
              Te acompañamos desde la primera sesión hasta la credencial.
            </p>
          </Reveal>
        </div>

        <StarDivider className="mt-16" />
      </Section>

      {/* Sede */}
      <Section id="sede" tone="velo">
        <Reveal>
          <Eyebrow>02 — Sede</Eyebrow>
          <SectionTitle>
            {NOSOTROS.sede.ciudad}, {NOSOTROS.sede.estado}
          </SectionTitle>
          <Lead>
            La primera sucursal de Boston Skilling Center opera de forma presencial.
            Las siguientes sedes seguirán el mismo modelo y el mismo estándar de
            credencial.
          </Lead>
        </Reveal>

        <Reveal group className="mt-10 grid gap-5 sm:grid-cols-2">
          <RevealItem className="rounded-card border border-border bg-white p-8">
            <Ilustracion nombre="edificios" className="w-28" />
            <h3 className="mt-5 text-h3 text-brand">Dónde estamos</h3>
            <address className="mt-2 space-y-1 text-[14px] not-italic leading-relaxed text-muted-foreground">
              <p>{NOSOTROS.sede.direccion}</p>
              <p>
                {NOSOTROS.sede.ciudad}, {NOSOTROS.sede.estado},{" "}
                {NOSOTROS.sede.pais}
              </p>
              <p className="text-[#888888]">{NOSOTROS.sede.horario}</p>
            </address>
          </RevealItem>

          <RevealItem className="rounded-card border border-border bg-white p-8">
            <Ilustracion nombre="equipo" className="w-28" />
            <h3 className="mt-5 text-h3 text-brand">Para empresas</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
              Trabajamos con organizaciones de la región para diagnosticar brechas
              de habilidades y armar un plan de formación por área, con seguimiento
              trimestral y credenciales para cada persona del equipo.
            </p>
            <CtaLink
              href="/#contacto"
              variant="secondary"
              className="mt-6"
            >
              Agendar un diagnóstico
            </CtaLink>
          </RevealItem>
        </Reveal>
      </Section>

      {/* Cierre */}
      <Section tone="papel" className="border-b-0">
        <Reveal className="mx-auto max-w-[640px] text-center">
          <SectionTitle>Conoce la oferta</SectionTitle>
          <p className="mt-3 text-pretty text-[16.5px] leading-relaxed text-muted-foreground">
            Cursos, talleres y consultoría, con inscripción abierta durante todo el
            año.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <CtaLink href="/#oferta">Ver la oferta</CtaLink>
            <CtaLink href={`${SITIO.appUrl}/registro`} variant="secondary">
              Inscribirme
            </CtaLink>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
