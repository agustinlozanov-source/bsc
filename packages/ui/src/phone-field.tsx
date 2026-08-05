"use client";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { cn } from "@bsc/utils";

export type PhoneFieldProps = {
  value?: string;
  onChange: (value?: string) => void;
  id?: string;
  className?: string;
  disabled?: boolean;
};

const inputClass =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

/** Teléfono con selector de país (default México), entrega formato E.164. */
export function PhoneField({
  value,
  onChange,
  id,
  className,
  disabled,
}: PhoneFieldProps) {
  return (
    <PhoneInput
      id={id}
      defaultCountry="MX"
      international
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={cn("bsc-phone flex items-center gap-2", className)}
      numberInputProps={{ className: inputClass }}
    />
  );
}
