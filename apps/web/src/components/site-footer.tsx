import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { Skyline } from "@/components/brand/skyline";
import { NAV, NOSOTROS, SITIO } from "@/lib/content";

export function SiteFooter() {
  const año = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-brand text-white">
      <Skyline className="bsc-motivo bottom-0 left-0 h-[160px] w-auto text-white" />

      <div className="relative mx-auto max-w-[1180px] px-5 py-16 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Wordmark tone="inverse" />
            <p className="mt-4 max-w-[260px] text-[13px] leading-relaxed text-brand-veil">
              {SITIO.descripcion}
            </p>
          </div>

          <nav aria-label="Pie de página">
            <h2 className="text-eyebrow uppercase text-brand-tertiary">Sitio</h2>
            <ul className="mt-4 space-y-2">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[13.5px] text-brand-veil underline-offset-4 hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-eyebrow uppercase text-brand-tertiary">
              Plataforma
            </h2>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href={`${SITIO.appUrl}/login`}
                  className="text-[13.5px] text-brand-veil underline-offset-4 hover:underline"
                >
                  Entrar a la plataforma
                </a>
              </li>
              <li>
                <a
                  href={SITIO.verifyUrl}
                  className="text-[13.5px] text-brand-veil underline-offset-4 hover:underline"
                >
                  Verificar una credencial
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-eyebrow uppercase text-brand-tertiary">Sede</h2>
            <address className="mt-4 space-y-1 text-[13.5px] not-italic text-brand-veil">
              <p>
                {NOSOTROS.sede.ciudad}, {NOSOTROS.sede.estado}
              </p>
              <p>{NOSOTROS.sede.direccion}</p>
              <p>{NOSOTROS.sede.horario}</p>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap justify-between gap-3 border-t border-white/15 pt-6 text-[12.5px] text-brand-tertiary">
          <span>
            © {año} {SITIO.nombre}
          </span>
          <span>Reynosa, Tamaulipas · México</span>
        </div>
      </div>
    </footer>
  );
}
