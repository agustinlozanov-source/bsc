"use client";

import * as React from "react";
import { ArrowUpDown, LayoutGrid, List, Plus, Search } from "lucide-react";
import { cn } from "@bsc/utils";
import { Input } from "./input";
import { buttonVariants } from "./button";

export type Column<T> = {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  /** Valor plano para ordenar/buscar. */
  value?: (row: T) => string | number;
};

export function DataTable<T>({
  data,
  columns,
  getRowId,
  searchText,
  searchPlaceholder = "Buscar…",
  newHref,
  newLabel = "Nuevo",
  renderCard,
  rowActions,
  emptyLabel = "Sin registros.",
}: {
  data: T[];
  columns: Column<T>[];
  getRowId: (row: T) => string;
  searchText?: (row: T) => string;
  searchPlaceholder?: string;
  newHref?: string;
  newLabel?: string;
  renderCard?: (row: T) => React.ReactNode;
  rowActions?: (row: T) => React.ReactNode;
  emptyLabel?: string;
}) {
  const [query, setQuery] = React.useState("");
  const [view, setView] = React.useState<"list" | "cards">("list");
  const [sort, setSort] = React.useState<{
    key: string;
    dir: "asc" | "desc";
  } | null>(null);

  let rows = data;
  if (query.trim() && searchText) {
    const q = query.toLowerCase();
    rows = rows.filter((r) => searchText(r).toLowerCase().includes(q));
  }
  if (sort) {
    const col = columns.find((c) => c.key === sort.key);
    if (col?.value) {
      rows = [...rows].sort((a, b) => {
        const va = col.value!(a);
        const vb = col.value!(b);
        if (va < vb) return sort.dir === "asc" ? -1 : 1;
        if (va > vb) return sort.dir === "asc" ? 1 : -1;
        return 0;
      });
    }
  }

  const toggleSort = (key: string) =>
    setSort((s) =>
      s?.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[12rem] flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-1 rounded-md border p-0.5">
          <button
            type="button"
            onClick={() => setView("list")}
            className={cn(
              "rounded p-1.5",
              view === "list" ? "bg-muted" : "text-muted-foreground",
            )}
            aria-label="Vista lista"
          >
            <List className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setView("cards")}
            className={cn(
              "rounded p-1.5",
              view === "cards" ? "bg-muted" : "text-muted-foreground",
            )}
            aria-label="Vista tarjetas"
          >
            <LayoutGrid className="size-4" />
          </button>
        </div>
        {newHref ? (
          <a href={newHref} className={buttonVariants({ size: "sm" })}>
            <Plus className="size-4" /> {newLabel}
          </a>
        ) : null}
      </div>

      {rows.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          {emptyLabel}
        </p>
      ) : view === "cards" && renderCard ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <div key={getRowId(r)}>{renderCard(r)}</div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-left">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className="px-3 py-2 font-medium">
                    {c.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(c.key)}
                        className="inline-flex items-center gap-1 hover:text-foreground"
                      >
                        {c.header}
                        <ArrowUpDown className="size-3 opacity-50" />
                      </button>
                    ) : (
                      c.header
                    )}
                  </th>
                ))}
                {rowActions ? <th className="px-3 py-2" /> : null}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={getRowId(r)} className="border-b last:border-0">
                  {columns.map((c) => (
                    <td key={c.key} className="px-3 py-2">
                      {c.render ? c.render(r) : String(c.value?.(r) ?? "")}
                    </td>
                  ))}
                  {rowActions ? (
                    <td className="px-3 py-2 text-right">{rowActions(r)}</td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
