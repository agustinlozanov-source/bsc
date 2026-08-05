"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export function QuickView({
  open,
  onOpenChange,
  title,
  children,
  footer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l bg-card shadow-lg data-[state=open]:animate-in data-[state=open]:slide-in-from-right">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <Dialog.Title className="text-lg font-semibold">
              {title}
            </Dialog.Title>
            <Dialog.Close
              className="rounded p-1 text-muted-foreground hover:bg-muted"
              aria-label="Cerrar"
            >
              <X className="size-4" />
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
          {footer ? <div className="border-t px-6 py-4">{footer}</div> : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
