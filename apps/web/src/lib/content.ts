import {
  IconCalendario,
  IconCertificado,
  IconConsultoria,
  IconCurso,
  IconInstructor,
  IconTaller,
} from "@/components/brand/icons";

/**
 * Copy del sitio público en un solo lugar, para que marketing pueda editarlo sin
 * tocar componentes.
 *
 * TODO(contenido): todo lo marcado con `borrador: true` es texto de trabajo y
 * debe validarse con BSC antes de publicar. Las cifras de `indicadores` NO son
 * reales — no publicar sin confirmarlas.
 */

export const SITIO = {
  nombre: "Boston Skilling Center",
  descripcion:
    "Centro de desarrollo de habilidades profesionales: cursos, talleres y consultoría presenciales en Reynosa, Tamaulipas.",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "https://app.bostonskillingcenter.com",
  verifyUrl:
    process.env.NEXT_PUBLIC_VERIFY_URL ?? "https://verify.bostonskillingcenter.com",
} as const;

export const NAV = [
  { href: "/#oferta", label: "Oferta" },
  { href: "/#modelo", label: "Modelo" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/#contacto", label: "Contacto" },
] as const;

/** Las tres líneas de servicio del centro. */
export const OFERTA = [
  {
    id: "cursos",
    icono: IconCurso,
    titulo: "Cursos",
    descripcion:
      "Programas estructurados por competencia, con evaluación y credencial verificable al terminar.",
    detalle: ["Duración de 4 a 12 semanas", "Grupos reducidos", "Sesiones presenciales"],
    nivel: "basico",
  },
  {
    id: "talleres",
    icono: IconTaller,
    titulo: "Talleres",
    descripcion:
      "Intensivos de una o dos sesiones sobre una habilidad concreta y aplicable de inmediato.",
    detalle: ["Formato intensivo", "Cupo limitado", "Material incluido"],
    nivel: "intermedio",
  },
  {
    id: "consultoria",
    icono: IconConsultoria,
    titulo: "Consultoría",
    descripcion:
      "Acompañamiento a empresas para diagnosticar brechas de habilidades y diseñar el plan de formación.",
    detalle: ["Diagnóstico inicial", "Plan por área", "Seguimiento trimestral"],
    nivel: "avanzado",
  },
] as const;

/** Diferenciadores — el "por qué BSC" del patrón Trust & Authority. */
export const MODELO = [
  {
    icono: IconInstructor,
    titulo: "Instructores en activo",
    descripcion:
      "Cada programa lo imparte alguien que ejerce la disciplina que enseña, no un divulgador.",
  },
  {
    icono: IconCertificado,
    titulo: "Credenciales verificables",
    descripcion:
      "Las constancias se emiten como Open Badges 3.0: cualquiera puede comprobar su validez en línea.",
  },
  {
    icono: IconCalendario,
    titulo: "Presencial y por objetivos",
    descripcion:
      "Formación en sede con seguimiento individual: cada persona avanza contra objetivos propios.",
  },
] as const;

/**
 * Franja de indicadores.
 *
 * Solo contiene hechos verificables hoy. En cuanto dirección confirme las cifras
 * reales (personas formadas, empresas aliadas, índice de conclusión), sustituir
 * las dos primeras entradas por esos números — son las que más peso tienen en el
 * patrón institucional.
 */
export const INDICADORES = [
  { valor: "100%", etiqueta: "Presencial" },
  { valor: "3", etiqueta: "Líneas de servicio" },
  { valor: "Reynosa", etiqueta: "Sede, Tamaulipas" },
  { valor: "OB 3.0", etiqueta: "Credenciales verificables" },
] as const;

/**
 * Sección de seguimiento — el eje del relato: "lo que pasa después importa
 * tanto como lo que pasa durante".
 *
 * TODO(contenido): confirmar con dirección el alcance real de la atención antes
 * de publicar. "Disponible a cualquier hora" describe un agente automático que
 * responde siempre; si además hay atención humana 24/7, hay que decirlo aparte,
 * y si no la hay, esta redacción no debe insinuarlo.
 */
export const SEGUIMIENTO = {
  puntos: [
    {
      titulo: "Un objetivo, no una asistencia",
      descripcion:
        "Al inscribirte declaras qué quieres lograr y en qué plazo. Eso queda registrado junto al programa.",
    },
    {
      titulo: "Disponible a cualquier hora",
      descripcion:
        "El agente responde cuando tú escribes, sin horario de oficina y sin repetir tu historia cada vez.",
    },
    {
      titulo: "Y vuelve al sistema",
      descripcion:
        "Lo que respondes ajusta qué enseñamos, cómo lo enseñamos y quién lo imparte.",
    },
  ],
} as const;

/** Página Nosotros. */
export const NOSOTROS = {
  intro:
    "Boston Skilling Center es un centro de desarrollo de habilidades profesionales. Trabajamos de forma presencial, con grupos reducidos y un seguimiento por objetivos que no termina cuando termina el curso.",
  bloques: [
    {
      titulo: "Qué hacemos",
      texto:
        "Diseñamos e impartimos formación profesional en tres formatos —cursos, talleres y consultoría— sobre habilidades que las empresas de la región piden hoy. Cada programa se construye alrededor de una competencia observable, no de un temario genérico.",
    },
    {
      titulo: "Cómo enseñamos",
      texto:
        "El modelo es presencial por decisión, no por limitación: la práctica supervisada y la conversación con un instructor en activo son difíciles de sustituir. La plataforma acompaña ese trabajo — registra objetivos, avance y credenciales — pero no reemplaza el aula.",
    },
    {
      titulo: "Qué acreditamos",
      texto:
        "Al terminar, cada persona recibe una credencial digital bajo el estándar Open Badges 3.0, verificable de forma independiente por cualquier empleador sin depender de nosotros.",
    },
  ],
  sede: {
    ciudad: "Reynosa",
    estado: "Tamaulipas",
    pais: "México",
    // TODO(contenido): dirección, teléfono y horario reales de la sucursal.
    direccion: "Dirección por confirmar",
    horario: "Lunes a viernes · horario por confirmar",
  },
} as const;
