import type { LanguageCode, Translations } from "@/types";
import { getUnitLabel } from "@/utils/measurementUnits";

const MOVEMENT_TYPE_KEYS: Record<string, keyof Translations | string> = {
  STOCK_IN: "stockMovementIn",
  STOCK_OUT: "stockMovementOut",
  ADJUSTMENT: "stockMovementAdjustment",
};

const KNOWN_NOTE_KEYS: Record<string, keyof Translations | string> = {
  "initial stock": "stockMovementInitialNote",
  "stock added": "stockMovementAddedNote",
};

const ORDER_DEDUCTION_PREFIX = "order stock deduction for product:";

export function getMovementTypeLabel(
  movementType: string | undefined,
  translations: Translations
): string {
  if (!movementType) return "";
  const key = MOVEMENT_TYPE_KEYS[String(movementType).toUpperCase()];
  if (key && translations[key as keyof Translations]) {
    return String(translations[key as keyof Translations]);
  }
  return movementType;
}

export function getMovementNoteLabel(
  note: string | undefined,
  translations: Translations
): string {
  if (!note) return "";
  const normalized = note.trim().toLowerCase();
  const knownKey = KNOWN_NOTE_KEYS[normalized];
  if (knownKey && translations[knownKey as keyof Translations]) {
    return String(translations[knownKey as keyof Translations]);
  }

  if (normalized.startsWith(ORDER_DEDUCTION_PREFIX)) {
    const productName = note.slice(ORDER_DEDUCTION_PREFIX.length).trim();
    const template =
      translations.stockMovementOrderDeduction ||
      "Order deduction: {product}";
    return template.replace("{product}", productName);
  }

  return note;
}

export function formatMovementLine(
  movement: { movement_type?: string; quantity?: number; unit?: string },
  translations: Translations,
  language: LanguageCode
): string {
  const typeLabel = getMovementTypeLabel(movement.movement_type, translations);
  const unitLabel = getUnitLabel(movement.unit || "", language);
  return `${typeLabel} - ${movement.quantity} ${unitLabel}`;
}
