"use client";

import { useMemo } from "react";
import { useAppSelector } from "@/presentation/state/hooks";
import { createTranslator } from "@/utils/i18n";

export function useTranslation() {
  const { language, translations } = useAppSelector((s) => s.user);

  const t = useMemo(
    () => createTranslator(translations, language),
    [translations, language],
  );

  return { t, language, translations };
}
