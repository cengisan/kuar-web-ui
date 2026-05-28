"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/presentation/state/hooks";

function applyThemeClass(theme: "dark" | "light") {
  document.documentElement.classList.toggle("light", theme === "light");
}

export function ThemeSync() {
  const theme = useAppSelector((s) => s.user.theme);

  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  return null;
}
