import type { Config } from "tailwindcss";

/**
 * Preset de Tailwind compartido por todas las apps del monorepo.
 * Mapea las variables CSS de shadcn (definidas en globals.css) y añade la
 * paleta de marca BSC. Cada app lo consume vía `presets: [bscPreset]`.
 *
 * Fuente de verdad: Sistema de Diseño BSC v1.0.
 */
const preset: Partial<Config> = {
  darkMode: "class",
  content: [],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Acentos institucionales — máx. 5% de cualquier composición (guía §02)
        gold: {
          DEFAULT: "hsl(var(--gold))",
          foreground: "hsl(var(--gold-foreground))",
          veil: "hsl(var(--gold-veil))",
        },
        brick: {
          DEFAULT: "hsl(var(--brick))",
          foreground: "hsl(var(--brick-foreground))",
          veil: "hsl(var(--brick-veil))",
        },
        // Paleta de marca BSC (valores fijos, no dependen del tema)
        brand: {
          DEFAULT: "#18490e", // verde principal
          secondary: "#2d6b1e", // verde medio
          tertiary: "#6a9e5a", // verde claro
          veil: "#e8f0e6", // verde velo
          paper: "#fafaf8", // papel
          line: "#e0e0e0", // línea
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 1px)",
        sm: "calc(var(--radius) - 2px)",
        // Radios excepcionales documentados en la guía §07
        card: "6px",
        cover: "32px",
      },
      fontFamily: {
        // Familia única del sistema (guía §03)
        sans: ["var(--font-elms-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Escala tipográfica de la guía §03
        display: ["clamp(2.25rem,5vw,3.625rem)", { lineHeight: "1.03", letterSpacing: "-0.0625rem", fontWeight: "900" }],
        h1: ["clamp(1.75rem,3.4vw,2.25rem)", { lineHeight: "1.1", letterSpacing: "-0.03125rem", fontWeight: "800" }],
        h2: ["1.625rem", { lineHeight: "1.2", fontWeight: "700" }],
        h3: ["1.1875rem", { lineHeight: "1.3", fontWeight: "600" }],
        caption: ["0.8125rem", { lineHeight: "1.4", fontWeight: "500" }],
        eyebrow: ["0.75rem", { lineHeight: "1.2", letterSpacing: "0.125rem", fontWeight: "700" }],
      },
      spacing: {
        // Retícula de 8px
        section: "4.75rem", // 76px — separación vertical entre secciones
      },
      transitionTimingFunction: {
        // Curva única del sistema para entradas y hovers
        bsc: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default preset;
