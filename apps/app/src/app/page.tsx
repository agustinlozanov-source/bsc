import { Button } from "@bsc/ui";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-brand">
        Sistema Operativo · v0
      </span>
      <h1 className="text-4xl font-bold tracking-tight text-brand">
        Boston Skilling Center
      </h1>
      <p className="text-muted-foreground">
        Andamiaje inicial listo. El login, el enrutado por rol y los dashboards
        de los 5 perfiles llegan en las siguientes fases.
      </p>
      <div className="flex gap-3">
        <Button>Comenzar</Button>
        <Button variant="outline">Documentación</Button>
      </div>
    </main>
  );
}
