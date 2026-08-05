"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@bsc/ui";
import type { UserRole } from "@bsc/validators";
import { NAV_BY_ROLE } from "@/lib/navigation";

export function Sidebar({
  role,
  roleLabel,
}: {
  role: UserRole;
  roleLabel: string;
}) {
  const pathname = usePathname();
  const items = NAV_BY_ROLE[role];

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-card md:flex">
      <div className="flex h-12 items-center border-b px-5">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {roleLabel}
        </span>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.href ? pathname === item.href : false;

          if (!item.href) {
            return (
              <span
                key={item.label}
                title="Próximamente"
                className="flex cursor-default items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground/70"
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </span>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/80 hover:bg-muted",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
