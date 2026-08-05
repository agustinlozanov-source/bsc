"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, BookOpen, Award } from "lucide-react";
import type { UserRole } from "@bsc/validators";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@bsc/ui";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Results = {
  people: { id: string; first_name: string; last_name: string }[];
  courses: { id: string; title: string }[];
  credentials: { credential_id: string }[];
};

const EMPTY: Results = { people: [], courses: [], credentials: [] };

export function GlobalSearch({ primaryRole }: { primaryRole: UserRole }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Results>(EMPTY);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    document.addEventListener("keydown", onKey);
    window.addEventListener("bsc:open-search", onOpen);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("bsc:open-search", onOpen);
    };
  }, []);

  useEffect(() => {
    const q = query.trim().replace(/[%,()]/g, "");
    if (q.length < 2) {
      setResults(EMPTY);
      return;
    }
    const supabase = createSupabaseBrowserClient();
    let active = true;
    const t = setTimeout(async () => {
      const [people, courses, creds] = await Promise.all([
        supabase
          .from("user_profile")
          .select("id, first_name, last_name")
          .or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%`)
          .limit(5),
        supabase.from("program").select("id, title").ilike("title", `%${q}%`).limit(5),
        supabase
          .from("credential_issued")
          .select("credential_id")
          .ilike("credential_id", `%${q}%`)
          .limit(5),
      ]);
      if (!active) return;
      setResults({
        people: (people.data as Results["people"] | null) ?? [],
        courses: (courses.data as Results["courses"] | null) ?? [],
        credentials: (creds.data as Results["credentials"] | null) ?? [],
      });
    }, 200);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [query]);

  function go(path: string) {
    setOpen(false);
    setQuery("");
    router.push(path);
  }

  const courseHref = (id: string) =>
    primaryRole === "professional"
      ? `/professional/academico/${id}`
      : "/user/catalogo";

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Buscar cursos, personas, credenciales…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {query.trim().length < 2
            ? "Escribe para buscar…"
            : "Sin resultados."}
        </CommandEmpty>

        {results.people.length > 0 ? (
          <CommandGroup heading="Personas">
            {results.people.map((p) => (
              <CommandItem
                key={p.id}
                value={`persona-${p.id}-${p.first_name} ${p.last_name}`}
                onSelect={() => {
                  setOpen(false);
                  toast.info("Perfil de personas — próximamente");
                }}
              >
                <User className="size-4 text-muted-foreground" />
                {`${p.first_name} ${p.last_name}`.trim()}
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}

        {results.courses.length > 0 ? (
          <CommandGroup heading="Cursos">
            {results.courses.map((c) => (
              <CommandItem
                key={c.id}
                value={`curso-${c.id}-${c.title}`}
                onSelect={() => go(courseHref(c.id))}
              >
                <BookOpen className="size-4 text-muted-foreground" />
                {c.title}
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}

        {results.credentials.length > 0 ? (
          <CommandGroup heading="Credenciales">
            {results.credentials.map((c) => (
              <CommandItem
                key={c.credential_id}
                value={`cred-${c.credential_id}`}
                onSelect={() => go(`/verify/${c.credential_id}`)}
              >
                <Award className="size-4 text-muted-foreground" />
                {c.credential_id}
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}
      </CommandList>
    </CommandDialog>
  );
}
