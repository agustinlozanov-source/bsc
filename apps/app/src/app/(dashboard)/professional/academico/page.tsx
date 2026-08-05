import Link from "next/link";
import { Plus, BookOpen } from "lucide-react";
import type { FormatType, ModalityType } from "@bsc/validators";
import { formatMXN } from "@bsc/utils";
import {
  buttonVariants,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@bsc/ui";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { FORMAT_LABEL, MODALITY_LABEL } from "@/lib/labels";

type ProgramRow = {
  id: string;
  title: string;
  format: FormatType;
  modality: ModalityType;
  price_mxn: number | null;
  is_published: boolean | null;
};

export default async function PortalAcademicoPage() {
  await requireRole("professional");
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profRes = await supabase
    .from("professional_profile")
    .select("id")
    .eq("user_id", user!.id)
    .maybeSingle();
  const profId = (profRes.data as { id: string } | null)?.id;

  let programs: ProgramRow[] = [];
  if (profId) {
    const res = await supabase
      .from("program")
      .select("id, title, format, modality, price_mxn, is_published")
      .eq("professional_id", profId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    programs = (res.data as ProgramRow[] | null) ?? [];
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-brand">
            Portal académico
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Mis cursos</h1>
        </div>
        <Link
          href="/professional/academico/nuevo"
          className={buttonVariants()}
        >
          <Plus className="size-4" /> Crear curso
        </Link>
      </div>

      {programs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <BookOpen className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Aún no tienes cursos. Crea el primero.
            </p>
            <Link
              href="/professional/academico/nuevo"
              className={buttonVariants({ variant: "outline" })}
            >
              <Plus className="size-4" /> Crear curso
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((p) => (
            <Card key={p.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">{p.title}</CardTitle>
                  <span
                    className={
                      p.is_published
                        ? "rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                        : "rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                    }
                  >
                    {p.is_published ? "Publicado" : "Borrador"}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-muted-foreground">
                <p>
                  {FORMAT_LABEL[p.format]} · {MODALITY_LABEL[p.modality]}
                </p>
                <p className="font-medium text-foreground">
                  {p.price_mxn != null ? formatMXN(Number(p.price_mxn)) : "—"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
