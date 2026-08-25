import type { Metadata } from "next";
import { elmsSans } from "@bsc/ui/font";
import "@bsc/ui/globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITIO } from "@/lib/content";

export const metadata: Metadata = {
  metadataBase: new URL("https://bostonskillingcenter.com"),
  title: {
    default: `${SITIO.nombre} — Cursos, talleres y consultoría`,
    template: `%s · ${SITIO.nombre}`,
  },
  description: SITIO.descripcion,
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: SITIO.nombre,
    title: SITIO.nombre,
    description: SITIO.descripcion,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={elmsSans.variable}>
      <head>
        {/*
          Los bloques con entrada al scroll se renderizan con opacidad 0 desde el
          servidor. Sin JavaScript nunca se animarían, así que se fuerza el estado
          final: el contenido siempre es legible.
        */}
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
        >
          Saltar al contenido
        </a>
        <SiteHeader />
        <main id="contenido">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
