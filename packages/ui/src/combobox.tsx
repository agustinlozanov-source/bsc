"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@bsc/utils";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "./command";

export type ComboOption = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

const triggerClass =
  "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50";

const contentClass =
  "z-50 w-[var(--radix-popover-trigger-width)] min-w-[14rem] rounded-md border bg-popover p-0 text-popover-foreground shadow-md";

/** Combobox de selección única con búsqueda fuzzy. */
export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Selecciona…",
  searchPlaceholder = "Buscar…",
  emptyText = "Sin resultados",
  id,
  className,
  disabled,
}: {
  options: ComboOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button type="button" id={id} disabled={disabled} className={cn(triggerClass, className)}>
          <span className="flex items-center gap-2 truncate">
            {selected?.icon}
            {selected ? (
              selected.label
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="start" sideOffset={4} className={contentClass}>
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((o) => (
                  <CommandItem
                    key={o.value}
                    value={`${o.label} ${o.value}`}
                    onSelect={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                  >
                    {o.icon}
                    <span className="truncate">{o.label}</span>
                    <Check
                      className={cn(
                        "ml-auto size-4",
                        value === o.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

/** Combobox de selección múltiple con búsqueda fuzzy. */
export function MultiCombobox({
  options,
  values,
  onChange,
  placeholder = "Selecciona…",
  searchPlaceholder = "Buscar…",
  emptyText = "Sin resultados",
  id,
  className,
  disabled,
}: {
  options: ComboOption[];
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const toggle = (v: string) =>
    onChange(values.includes(v) ? values.filter((x) => x !== v) : [...values, v]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button type="button" id={id} disabled={disabled} className={cn(triggerClass, className)}>
          <span className="truncate">
            {values.length > 0 ? (
              `${values.length} seleccionada${values.length > 1 ? "s" : ""}`
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="start" sideOffset={4} className={contentClass}>
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((o) => (
                  <CommandItem
                    key={o.value}
                    value={`${o.label} ${o.value}`}
                    onSelect={() => toggle(o.value)}
                  >
                    {o.icon}
                    <span className="truncate">{o.label}</span>
                    <Check
                      className={cn(
                        "ml-auto size-4",
                        values.includes(o.value) ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
