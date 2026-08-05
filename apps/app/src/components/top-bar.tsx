"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Bell, Search, Moon, Sun, User, Settings, LogOut } from "lucide-react";
import type { UserRole } from "@bsc/validators";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@bsc/ui";
import { signOut } from "@/app/(auth)/actions";

export type OtherRole = { role: UserRole; label: string; href: string };

export function TopBar({
  fullName,
  roleLabel,
  email,
  tenantName,
  otherRoles,
  profileHref,
}: {
  fullName: string;
  roleLabel: string;
  email: string;
  tenantName: string | null;
  otherRoles: OtherRole[];
  profileHref?: string;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const initials = fullName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b bg-card px-4">
      {/* Izquierda */}
      <div className="flex items-center gap-3">
        <Link href="/" className="text-lg font-bold text-brand">
          BSC
        </Link>
        {tenantName ? (
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {tenantName}
          </span>
        ) : null}
      </div>

      {/* Centro: buscador */}
      <button
        type="button"
        onClick={() => toast.info("Búsqueda global (⌘K) — próximamente")}
        className="hidden max-w-md flex-1 items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted sm:flex"
      >
        <Search className="size-4" />
        <span>Buscar…</span>
        <kbd className="ml-auto rounded border bg-muted px-1.5 text-xs">⌘K</kbd>
      </button>

      {/* Derecha */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => toast.info("Notificaciones — próximamente")}
          className="relative rounded-md p-2 text-muted-foreground hover:bg-muted"
          aria-label="Notificaciones"
        >
          <Bell className="size-5" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md p-1 pr-2 hover:bg-muted"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {initials}
              </span>
              <span className="hidden text-sm font-medium sm:inline">
                {fullName}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{fullName}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {roleLabel} · {email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {profileHref ? (
              <DropdownMenuItem asChild>
                <Link href={profileHref}>
                  <User className="size-4" /> Mi perfil
                </Link>
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem
              onSelect={() => toast.info("Configuración — próximamente")}
            >
              <Settings className="size-4" /> Configuración
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setTheme(resolvedTheme === "dark" ? "light" : "dark");
              }}
            >
              {resolvedTheme === "dark" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
              Tema {resolvedTheme === "dark" ? "claro" : "oscuro"}
            </DropdownMenuItem>

            {otherRoles.length > 0 ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Ver como
                </DropdownMenuLabel>
                {otherRoles.map((r) => (
                  <DropdownMenuItem key={r.role} asChild>
                    <Link href={r.href}>{r.label}</Link>
                  </DropdownMenuItem>
                ))}
              </>
            ) : null}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onSelect={() => {
                void signOut();
              }}
            >
              <LogOut className="size-4" /> Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
