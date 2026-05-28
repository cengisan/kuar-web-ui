"use client";

import * as React from "react";
import { Toaster as SonnerToaster } from "sonner";
import { useAppSelector } from "@/presentation/state/hooks";

export function Toaster() {
  const theme = useAppSelector((s) => s.user.theme);

  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      theme={theme}
      toastOptions={{
        style: {
          background: "var(--card)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
        },
        className: "rounded-lg",
      }}
    />
  );
}
