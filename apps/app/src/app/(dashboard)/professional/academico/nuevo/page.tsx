import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CourseForm } from "@/components/professional/course-form";

export type SkillOption = { id: string; name: string; category: string };

export default async function NuevoCursoPage() {
  await requireRole("professional");
  const supabase = createSupabaseServerClient();

  const res = await supabase
    .from("skill")
    .select("id, name, category")
    .eq("is_active", true)
    .order("category", { ascending: true })
    .order("name", { ascending: true });
  const skills = (res.data as SkillOption[] | null) ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/professional/academico"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Mis cursos
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Crear curso</h1>
        <p className="mt-1 text-muted-foreground">
          Define el programa, sus habilidades y el esquema de ingresos.
        </p>
      </div>
      <CourseForm skills={skills} />
    </div>
  );
}
