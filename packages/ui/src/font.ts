import localFont from "next/font/local";

/**
 * Elms Sans — familia única del sistema de diseño BSC (guía §03).
 *
 * Se auto-hospeda (Google Fonts, OFL) en lugar de usar `next/font/google`
 * porque la lista de fuentes que trae Next 14 es anterior a la publicación de
 * Elms Sans. Es una fuente variable: un solo archivo cubre los pesos 100–900.
 */
export const elmsSans = localFont({
  src: [
    {
      path: "../fonts/elms-sans-latin-var.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-elms-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});
