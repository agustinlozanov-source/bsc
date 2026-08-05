"use client";

import * as React from "react";
import { cn } from "@bsc/utils";

function formatDisplay(digits: string): string {
  if (digits === "") return "";
  const [int, dec] = digits.split(".");
  const intFmt = (int ?? "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return dec !== undefined ? `${intFmt}.${dec}` : intFmt;
}

export type MoneyInputProps = {
  value: number | null;
  onChange: (value: number | null) => void;
  id?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

/** Input de dinero MXN: muestra $XX,XXX.XX, entrega número puro. */
export function MoneyInput({
  value,
  onChange,
  id,
  placeholder = "0.00",
  className,
  disabled,
}: MoneyInputProps) {
  const [text, setText] = React.useState(
    value != null ? formatDisplay(String(value)) : "",
  );

  React.useEffect(() => {
    const current = text === "" ? null : Number(text.replace(/,/g, ""));
    if (value !== current) {
      setText(value != null ? formatDisplay(String(value)) : "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div
      className={cn(
        "flex h-9 items-center rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-within:ring-1 focus-within:ring-ring",
        disabled && "opacity-50",
        className,
      )}
    >
      <span className="mr-1 text-muted-foreground">$</span>
      <input
        id={id}
        inputMode="decimal"
        placeholder={placeholder}
        disabled={disabled}
        value={text}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^\d.]/g, "");
          const parts = raw.split(".");
          const digits =
            parts.length > 2
              ? `${parts[0]}.${parts.slice(1).join("")}`
              : raw;
          setText(formatDisplay(digits));
          const num = digits === "" || digits === "." ? null : Number(digits);
          onChange(num != null && Number.isFinite(num) ? num : null);
        }}
        className="w-full bg-transparent outline-none"
      />
    </div>
  );
}
