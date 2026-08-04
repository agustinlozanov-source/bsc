# Boston Skilling Center — Plataforma

Monorepo de la plataforma BSC: centro de desarrollo de habilidades profesionales,
multi-tenant (cada sucursal es un tenant aislado), con seguimiento de objetivos por
agentes de IA y motor de credenciales Open Badges 3.0.

## Arquitectura

| App | Dominio | Descripción | Estado |
|-----|---------|-------------|--------|
| `apps/app` | app.bostonskillingcenter.com | Sistema operativo (5 perfiles) | 🚧 En construcción |
| `apps/web` | bostonskillingcenter.com | Sitio público / marketing | ⏳ Pendiente |
| `apps/verify` | verify.bostonskillingcenter.com | Verificador de credenciales | ⏳ Pendiente |

### Packages compartidos

- `packages/ui` — Componentes shadcn/ui + tokens de marca BSC
- `packages/db` — Cliente Supabase + tipos generados
- `packages/validators` — Schemas Zod compartidos
- `packages/utils` — Utilidades compartidas

## Stack

Next.js 14 (App Router) · TypeScript estricto · Tailwind · shadcn/ui ·
Supabase (Postgres/Auth/Storage/Realtime) · Anthropic (agentes IA) · Turborepo · pnpm

## Requisitos

- Node >= 18.17 (recomendado 24, ver `.nvmrc`)
- pnpm (`corepack enable pnpm`)

## Setup

```bash
corepack enable pnpm
pnpm install
cp .env.example .env.local   # llenar valores
pnpm dev
```

## Marca

- Primario `#18490e` · Secundario `#2d6b1e` · Terciario `#6a9e5a`
- Fuente: Inter
- Primera sucursal: Reynosa, Tamaulipas

---

_Confidencial · BSC v0_
