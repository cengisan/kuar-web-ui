import { languages } from "@/config/languages";
import type { LanguageCode } from "@/types";

export type TranslationMap = Record<string, string>;

export function translate(
  translations: TranslationMap,
  key: string,
  language?: LanguageCode,
): string {
  const value = translations[key];
  if (value) return value;
  if (language) {
    const bundle = languages[language] as TranslationMap;
    const fallback = bundle[key];
    if (fallback) return fallback;
  }
  return key;
}

export function createTranslator(translations: TranslationMap, language: LanguageCode) {
  return (key: string) => translate(translations, key, language);
}
