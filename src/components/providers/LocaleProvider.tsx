"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/presentation/state/hooks";

export function LocaleProvider() {
  const { language } = useAppSelector((s) => s.user);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return null;
}
