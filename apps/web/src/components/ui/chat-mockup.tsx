"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@bsc/utils";

/**
 * Maqueta de laptop con la conversación de seguimiento de BSC.
 *
 * Adaptado del "Macbook Mockup" de Great UI (MIT — Saurabh Sharma,
 * https://github.com/Saurabh-2607/GreatUI). Cambios respecto al original:
 *  - El original replica la interfaz de WhatsApp (paleta #00a884/#dcf8c6, doble
 *    check azul, aviso de cifrado extremo a extremo). Aquí es la plataforma de
 *    BSC: paleta de marca y ningún elemento identificable de otro producto.
 *  - Sin fotos de Unsplash: los avatares son los SVG de la familia BSC.
 *  - Usa `motion` en vez de `framer-motion`, y respeta `prefers-reduced-motion`
 *    mostrando la conversación completa sin animarla.
 */

type IconProps = { className?: string };

const iconBase = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

const IconBuscar = ({ className }: IconProps) => (
  <svg className={className} {...iconBase}>
    <circle cx="11" cy="11" r="7.5" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconMas = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="5" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="12" cy="19" r="1.6" />
  </svg>
);

const IconAdjuntar = ({ className }: IconProps) => (
  <svg className={className} {...iconBase}>
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

const IconEnviar = ({ className }: IconProps) => (
  <svg className={className} {...iconBase}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const IconReproducir = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <polygon points="6 4 20 12 6 20 6 4" />
  </svg>
);

const IconVisto = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 20 12" fill="currentColor" aria-hidden="true">
    <path d="M7.3 9.4 3.5 5.6l1-1 2.8 2.8L13.6.7l1 1z" />
    <path d="M12 9.4 8.2 5.6l1-1 2.8 2.8L18.3.7l1 1z" />
  </svg>
);

export interface ChatMessage {
  id: number;
  autor: string;
  texto: string;
  esUsuario: boolean;
  hora: string;
  esAudio?: boolean;
  duracion?: string;
  reaccion?: string;
}

/**
 * Conversación de ejemplo. Refleja el mecanismo real descrito en el relato:
 * al inscribirse, la persona declara un objetivo y un plazo; cumplido el plazo,
 * el agente la contacta para saber si lo logró y devuelve esa información al
 * sistema.
 *
 * TODO(contenido): validar los nombres de programa y las fechas con dirección
 * antes de publicar.
 */
const CONVERSACION: ChatMessage[] = [
  {
    id: 1,
    autor: "Agente BSC",
    texto:
      "Hola Daniela 👋 Hace tres meses cerraste Liderazgo Ágil. Tu objetivo era dirigir tu primer proyecto antes de junio. ¿Cómo vas con eso?",
    esUsuario: false,
    hora: "8:12",
  },
  {
    id: 2,
    autor: "Daniela",
    texto: "Nota de voz",
    esUsuario: true,
    hora: "8:14",
    esAudio: true,
    duracion: "0:34",
  },
  {
    id: 3,
    autor: "Agente BSC",
    texto:
      "Queda registrado. Me dices que lo más difícil fue manejar el desacuerdo dentro del equipo — eso lo cubre Negociación Estratégica, presencial, 8 horas. ¿Te aparto lugar?",
    esUsuario: false,
    hora: "8:15",
  },
  {
    id: 4,
    autor: "Daniela",
    texto: "Sí, apártamelo 🙌",
    esUsuario: true,
    hora: "8:16",
    reaccion: "✅",
  },
];

type ChatLateral = {
  id: string;
  nombre: string;
  avatar: string;
  ultimo: string;
  hora: string;
  sinLeer?: number;
  activo?: boolean;
};

const CHATS_LATERALES: ChatLateral[] = [
  {
    id: "1",
    nombre: "Agente BSC",
    avatar: "/brand/bsc-monograma.png",
    ultimo: "Queda registrado. ¿Te aparto lugar?",
    hora: "8:15",
    activo: true,
  },
  {
    id: "2",
    nombre: "Coordinación académica",
    avatar: "/brand/personajes/avatar-2.svg",
    ultimo: "Tu constancia ya está emitida",
    hora: "Ayer",
    sinLeer: 1,
  },
  {
    id: "3",
    nombre: "Grupo · Liderazgo Ágil",
    avatar: "/brand/personajes/avatar-1.svg",
    ultimo: "Nos vemos el jueves a las 9:00",
    hora: "Lun",
  },
];

export interface ChatMockupProps {
  titulo?: string;
  subtitulo?: string;
  mensajes?: ChatMessage[];
  /** Reproduce la conversación por pasos, en bucle. */
  autoPlay?: boolean;
  className?: string;
}

export function ChatMockup({
  titulo = "Agente BSC",
  subtitulo = "Seguimiento de objetivos · responde al instante",
  mensajes = CONVERSACION,
  autoPlay = true,
  className,
}: ChatMockupProps) {
  const reduced = useReducedMotion();
  const contenedorRef = useRef<HTMLDivElement>(null);
  const [visibles, setVisibles] = useState<ChatMessage[]>([]);
  const [escribiendo, setEscribiendo] = useState(false);
  const [ciclo, setCiclo] = useState(0);
  /** El bucle solo corre con la maqueta a la vista y la pestaña activa. */
  const [enCurso, setEnCurso] = useState(false);

  const animar = autoPlay && !reduced;

  useEffect(() => {
    const contenedor = contenedorRef.current;
    if (!animar || !contenedor) return;

    let visible = false;
    const evaluar = () => setEnCurso(visible && !document.hidden);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      evaluar();
    });
    io.observe(contenedor);
    document.addEventListener("visibilitychange", evaluar);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", evaluar);
    };
  }, [animar]);

  useEffect(() => {
    if (!animar || !enCurso) return;

    const temporizadores: ReturnType<typeof setTimeout>[] = [];
    const en = (ms: number, fn: () => void) => temporizadores.push(setTimeout(fn, ms));

    setVisibles([]);
    setEscribiendo(false);

    en(700, () => {
      setVisibles(mensajes.slice(0, 1));
      setEscribiendo(true);
    });
    en(2600, () => {
      setEscribiendo(false);
      setVisibles(mensajes.slice(0, 2));
    });
    en(3400, () => setEscribiendo(true));
    en(5200, () => {
      setEscribiendo(false);
      setVisibles(mensajes.slice(0, 3));
    });
    en(7400, () => setVisibles(mensajes));
    en(12000, () => setCiclo((c) => c + 1));

    return () => temporizadores.forEach(clearTimeout);
  }, [animar, enCurso, mensajes, ciclo]);

  /*
   * El estado de reposo es la conversación completa, no una pantalla vacía:
   * así se ve bien en el primer pintado, sin JavaScript, con movimiento
   * reducido y en una pestaña de fondo. Solo mientras el bucle corre de verdad
   * se muestra la secuencia paso a paso.
   */
  const aMostrar = animar && enCurso ? visibles : mensajes;

  return (
    <div
      ref={contenedorRef}
      className={cn(
        "relative mx-auto flex w-full max-w-[720px] select-none flex-col items-center",
        className,
      )}
    >
      {/* Pantalla */}
      <div className="relative z-10 flex h-[300px] w-full flex-col overflow-hidden rounded-t-xl bg-[#2a2a28] p-2 sm:h-[380px] sm:p-2.5">
        <div className="relative flex h-full w-full overflow-hidden rounded-t-[6px] bg-white">
          {/* Barra lateral */}
          <div className="hidden w-[190px] shrink-0 flex-col border-r border-border bg-brand-paper sm:flex md:w-[230px]">
            <div className="flex shrink-0 items-center justify-between border-b border-border px-3 py-2.5">
              <span className="text-[10px] font-bold uppercase tracking-[1.2px] text-brand">
                Mensajes
              </span>
              <IconMas className="h-3.5 w-3.5 text-[#888888]" />
            </div>

            <div className="p-2">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-2.5 py-1.5">
                <IconBuscar className="h-3 w-3 shrink-0 text-[#888888]" />
                <span className="truncate text-[10px] text-[#888888]">Buscar</span>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              {CHATS_LATERALES.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "relative flex items-center gap-2.5 px-3 py-2.5",
                    chat.activo && "bg-brand-veil",
                  )}
                >
                  {chat.activo ? (
                    <span className="absolute bottom-0 left-0 top-0 w-[3px] bg-brand" />
                  ) : null}
                  <Image
                    src={chat.avatar}
                    alt=""
                    width={64}
                    height={64}
                    unoptimized
                    className="h-7 w-7 shrink-0 rounded-full border border-border bg-white object-contain"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[10.5px] font-bold text-foreground">
                        {chat.nombre}
                      </span>
                      <span className="shrink-0 text-[9px] text-[#888888]">{chat.hora}</span>
                    </div>
                    <p className="mt-0.5 truncate text-[9.5px] text-[#888888]">{chat.ultimo}</p>
                  </div>
                  {chat.sinLeer ? (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand text-[9px] font-bold text-white">
                      {chat.sinLeer}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Conversación */}
          <div className="relative flex min-w-0 flex-1 flex-col bg-brand-paper">
            <div className="flex shrink-0 items-center justify-between border-b border-border bg-white px-3.5 py-2">
              <div className="flex min-w-0 items-center gap-2.5">
                <Image
                  src="/brand/bsc-monograma.png"
                  alt=""
                  width={80}
                  height={56}
                  className="h-7 w-7 shrink-0 rounded-full border border-border bg-white object-contain p-1"
                />
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-[11.5px] font-bold leading-tight text-foreground">
                    {titulo}
                  </span>
                  <span className="truncate text-[9.5px] text-brand-secondary">{subtitulo}</span>
                </div>
              </div>
              <IconMas className="h-3.5 w-3.5 shrink-0 text-[#888888]" />
            </div>

            <div className="flex min-h-0 flex-1 flex-col justify-end gap-2 overflow-hidden p-3.5">
              {/*
                Divulgación explícita: quien conversa es un agente automático.
                No lo disfrazamos de persona.
              */}
              <div className="mx-auto rounded-full bg-gold-veil px-2.5 py-1 text-center text-[9px] font-semibold text-gold">
                Conversación con un agente de IA de BSC
              </div>

              <div className="flex flex-1 flex-col justify-end gap-2 overflow-hidden">
                  {aMostrar.map((msg) => (
                    <motion.div
                      key={`${ciclo}-${msg.id}`}
                      initial={animar ? { opacity: 0, y: 8 } : false}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className={cn("flex", msg.esUsuario ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "relative max-w-[82%] rounded-card px-3 py-2",
                          msg.esUsuario
                            ? "rounded-tr-[2px] bg-brand text-white"
                            : "rounded-tl-[2px] border border-border bg-white text-foreground",
                        )}
                      >
                        {!msg.esUsuario ? (
                          <p className="mb-1 text-[9.5px] font-bold uppercase tracking-[0.8px] text-brand-secondary">
                            {msg.autor}
                          </p>
                        ) : null}

                        {msg.esAudio ? (
                          <div className="flex min-w-[170px] items-center gap-2.5 py-0.5">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
                              <IconReproducir className="ml-0.5 h-2.5 w-2.5 text-white" />
                            </span>
                            <span className="flex h-3 flex-1 items-center gap-[2px]">
                              {[40, 75, 30, 90, 60, 100, 45, 80, 50, 70, 35, 90, 65, 40].map(
                                (h, i) => (
                                  <span
                                    key={i}
                                    className="w-[2px] rounded-full bg-white/60"
                                    style={{ height: `${h}%` }}
                                  />
                                ),
                              )}
                            </span>
                            <span className="shrink-0 text-[9px] text-brand-veil">
                              {msg.duracion}
                            </span>
                          </div>
                        ) : (
                          <p className="text-[11px] leading-snug">{msg.texto}</p>
                        )}

                        <div className="mt-1 flex items-center justify-end gap-1">
                          <span
                            className={cn(
                              "text-[8.5px]",
                              msg.esUsuario ? "text-brand-veil" : "text-[#888888]",
                            )}
                          >
                            {msg.hora}
                          </span>
                          {msg.esUsuario ? (
                            <IconVisto className="h-2.5 w-3.5 text-brand-tertiary" />
                          ) : null}
                        </div>

                        {msg.reaccion ? (
                          <span className="absolute -bottom-2 right-2 rounded-full border border-border bg-white px-1.5 text-[9px]">
                            {msg.reaccion}
                          </span>
                        ) : null}
                      </div>
                    </motion.div>
                  ))}

                  {escribiendo ? (
                    <motion.div
                      key={`${ciclo}-escribiendo`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-center gap-1.5 rounded-card rounded-tl-[2px] border border-border bg-white px-3 py-2">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="h-1.5 w-1.5 rounded-full bg-brand-tertiary"
                            animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ) : null}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 border-t border-border bg-white p-2.5">
              <IconAdjuntar className="h-4 w-4 shrink-0 text-[#888888]" />
              <div className="flex-1 rounded-lg border border-border px-3 py-1.5 text-[10.5px] text-[#888888]">
                Escribe un mensaje
              </div>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                <IconEnviar className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Base de la laptop */}
      <div className="relative z-20 flex h-3.5 w-[104%] items-start justify-center rounded-b-lg bg-[#c9c9c4] sm:h-4">
        <div className="h-1.5 w-14 rounded-b-md bg-[#a8a8a2] sm:w-20" />
      </div>
    </div>
  );
}

export default ChatMockup;
