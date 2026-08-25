import { CoverHeader } from "@/components/cover-header";
import { Reveal, RevealItem } from "@/components/reveal";
import {
  CtaLink,
  Eyebrow,
  Lead,
  LevelTag,
  Section,
  SectionTitle,
  StarDivider,
} from "@/components/ui";
import { Ilustracion, Personaje } from "@/components/brand/illustrations";
import { ChatMockup } from "@/components/ui/chat-mockup";
import { Skyline } from "@/components/brand/skyline";
import { INDICADORES, MODELO, OFERTA, SEGUIMIENTO, SITIO } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <CoverHeader
        eyebrow="Reynosa, Tamaulipas"
        title="Habilidades profesionales que se practican, se evalúan y se acreditan"
        lead="Cursos, talleres y consultoría presenciales para personas y empresas que necesitan resultados verificables, no constancias de asistencia."
        scrollTo="oferta"
        media={<Personaje nombre="equipo" priority />}
      >
        <div className="flex flex-wrap gap-3">
          <CtaLink href="#oferta" variant="inverse">
            Ver la oferta
          </CtaLink>
          <CtaLink
            href={`${SITIO.appUrl}/registro`}
            variant="secondary"
            className="border-white text-white hover:bg-white/10"
          >
            Inscribirme
          </CtaLink>
        </div>
      </CoverHeader>

      {/* Franja de indicadores — la "prueba" del patrón institucional. */}
      <Section tone="papel" className="border-b-0 pt-28">
        <Reveal group>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            {INDICADORES.map((item) => (
              <RevealItem
                key={item.etiqueta}
                className="border-l-2 border-brand-tertiary pl-3"
              >
                <dt className="text-[11px] uppercase tracking-[1.5px] text-[#888888]">
                  {item.etiqueta}
                </dt>
                <dd className="mt-1 text-h2 text-brand">{item.valor}</dd>
              </RevealItem>
            ))}
          </dl>
        </Reveal>
        <StarDivider className="mt-14" />
      </Section>

      {/* Oferta */}
      <Section id="oferta" tone="papel">
        <Reveal>
          <Eyebrow>01 — Oferta</Eyebrow>
          <SectionTitle>Tres formas de trabajar con nosotros</SectionTitle>
          <Lead>
            Cada línea responde a una necesidad distinta: formar una competencia
            desde cero, resolver una brecha concreta en una sesión, o rediseñar el
            plan de formación de una organización completa.
          </Lead>
        </Reveal>

        <Reveal group className="mt-10 grid gap-5 md:grid-cols-3">
          {OFERTA.map((item) => {
            const Icono = item.icono;
            return (
              <RevealItem
                key={item.id}
                as="article"
                className="flex flex-col overflow-hidden rounded-card border border-border bg-white transition-colors duration-200 ease-bsc hover:border-brand-tertiary"
              >
                <div className="h-2 shrink-0 bg-brand-secondary" />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <Icono className="h-7 w-7 text-brand" />
                    <LevelTag nivel={item.nivel} />
                  </div>
                  <h3 className="mt-4 text-h3 text-foreground">{item.titulo}</h3>
                  <p className="mb-5 mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                    {item.descripcion}
                  </p>
                  <ul className="mt-auto space-y-2 border-t border-border pt-4">
                    {item.detalle.map((d) => (
                      <li
                        key={d}
                        className="flex items-center gap-2 text-caption text-[#888888]"
                      >
                        <span
                          aria-hidden="true"
                          className="h-1 w-1 rounded-full bg-brand-tertiary"
                        />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealItem>
            );
          })}
        </Reveal>
      </Section>

      {/* Modelo */}
      <Section id="modelo" tone="velo">
        <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:items-start">
          <div>
            <Reveal>
              <Eyebrow>02 — Modelo</Eyebrow>
              <SectionTitle>Presencial, por objetivos y verificable</SectionTitle>
              <Lead>
                No competimos con los cursos en línea: hacemos lo que ellos no
                pueden. Práctica supervisada, grupos pequeños y una constancia que
                un empleador puede comprobar sin llamarnos.
              </Lead>
            </Reveal>

            <Reveal group className="mt-10 space-y-6">
              {MODELO.map((item) => {
                const Icono = item.icono;
                return (
                  <RevealItem
                    key={item.titulo}
                    className="flex gap-4 border-b border-brand-tertiary/30 pb-6 last:border-b-0"
                  >
                    <Icono className="mt-1 h-6 w-6 shrink-0 text-brand" />
                    <div>
                      <h3 className="text-h3 text-brand">{item.titulo}</h3>
                      <p className="mt-1 max-w-[520px] text-[14px] leading-relaxed text-muted-foreground">
                        {item.descripcion}
                      </p>
                    </div>
                  </RevealItem>
                );
              })}
            </Reveal>
          </div>

          {/*
            El personaje va siempre sobre blanco o papel, nunca sobre verde velo
            (guía §Reglas de uso), por eso lleva su propia tarjeta blanca.
          */}
          <Reveal
            delay={0.1}
            className="mx-auto w-full max-w-[320px] rounded-card border border-border bg-white p-6 text-center"
          >
            <Personaje nombre="computadora" className="mx-auto w-[190px]" />
            <p className="mt-4 text-[13px] font-bold text-brand">
              Tu avance, siempre a la vista
            </p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[#888888]">
              La plataforma registra tus objetivos, tu progreso y tus credenciales
              desde el primer día.
            </p>
            <CtaLink
              href={`${SITIO.appUrl}/login`}
              variant="secondary"
              className="mt-5 w-full"
            >
              Entrar a la plataforma
            </CtaLink>
          </Reveal>
        </div>
      </Section>

      {/* Seguimiento — el mecanismo que distingue al centro */}
      <Section id="seguimiento" tone="papel">
        <Reveal className="mx-auto max-w-[680px] text-center">
          <Eyebrow align="center">03 — Seguimiento</Eyebrow>
          <SectionTitle>El programa termina. El acompañamiento no.</SectionTitle>
          <p className="mx-auto mt-3 max-w-[560px] text-pretty text-[16.5px] leading-relaxed text-muted-foreground">
            Cumplido el plazo que tú fijaste, un agente de BSC te busca para saber si
            lograste lo que venías a lograr. No es una encuesta de satisfacción: es
            una conversación sobre tu objetivo.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <ChatMockup />
        </Reveal>

        <Reveal group className="mt-14 grid gap-8 sm:grid-cols-3">
          {SEGUIMIENTO.puntos.map((punto, i) => (
            <RevealItem key={punto.titulo} className="border-t-2 border-brand-tertiary pt-4">
              <span className="text-eyebrow uppercase text-[#888888]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-h3 text-brand">{punto.titulo}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
                {punto.descripcion}
              </p>
            </RevealItem>
          ))}
        </Reveal>
      </Section>

      {/* Credenciales */}
      <Section tone="papel">
        <Reveal className="relative overflow-hidden rounded-card bg-brand px-6 py-12 text-white sm:px-12">
          <Skyline className="bsc-motivo -bottom-3 -right-5 h-[140px] w-auto text-white" />
          <div className="relative max-w-[520px]">
            <Eyebrow tone="inverse">04 — Credenciales</Eyebrow>
            <h2 className="text-h1">Open Badges 3.0, verificables por cualquiera</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-brand-veil">
              Cada constancia que emitimos es una credencial digital firmada bajo un
              estándar abierto. Quien la reciba puede comprobar su validez en línea,
              sin intermediarios y sin depender de que sigamos existiendo.
            </p>
            <CtaLink href={SITIO.verifyUrl} variant="inverse" className="mt-7">
              Verificar una credencial
            </CtaLink>
          </div>
          
        </Reveal>
      </Section>

      {/* Contacto / cierre */}
      <Section id="contacto" tone="blanco" className="border-b-0">
        <Reveal className="mx-auto max-w-[640px] text-center">
          <Eyebrow align="center">05 — Siguiente paso</Eyebrow>
          <SectionTitle>¿Empezamos?</SectionTitle>
          <p className="mt-3 text-pretty text-[16.5px] leading-relaxed text-muted-foreground">
            Si buscas formarte, inscríbete y elige tu primer objetivo. Si
            representas a una empresa, agendamos un diagnóstico sin costo para ver
            qué habilidades le faltan a tu equipo.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <CtaLink href={`${SITIO.appUrl}/registro`}>Inscribirme</CtaLink>
            {/* TODO(contenido): sustituir por el correo o formulario real. */}
            <CtaLink href="mailto:contacto@bostonskillingcenter.com" variant="secondary">
              Hablar con el centro
            </CtaLink>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
