export const MEASUREMENT_UNITS = [
  { key: "KILOGRAM", labelTr: "Kilogram (KG)", labelEn: "Kilogram (KG)" },
  { key: "GRAM", labelTr: "Gram (G)", labelEn: "Gram (G)" },
  { key: "LITRE", labelTr: "Litre (L)", labelEn: "Litre (L)" },
  { key: "MILLILITRE", labelTr: "Mililitre (ML)", labelEn: "Millilitre (ML)" },
  { key: "ADET", labelTr: "Adet", labelEn: "Piece" },
] as const;

const UNIT_FAMILY = {
  WEIGHT: "WEIGHT",
  VOLUME: "VOLUME",
  PIECE: "PIECE",
} as const;

const UNIT_TO_FAMILY: Record<string, string> = {
  KILOGRAM: UNIT_FAMILY.WEIGHT,
  GRAM: UNIT_FAMILY.WEIGHT,
  LITRE: UNIT_FAMILY.VOLUME,
  MILLILITRE: UNIT_FAMILY.VOLUME,
  ADET: UNIT_FAMILY.PIECE,
};

export function getUnitFamily(unit?: string | null) {
  if (!unit) return null;
  return UNIT_TO_FAMILY[unit] || null;
}

export function areUnitsCompatible(materialUnit?: string | null, usageUnit?: string | null) {
  if (!materialUnit || !usageUnit) return false;
  if (materialUnit === usageUnit) return true;
  return getUnitFamily(materialUnit) === getUnitFamily(usageUnit);
}

export function getCompatibleUnits(materialUnit?: string | null) {
  const family = getUnitFamily(materialUnit);
  if (!family) return MEASUREMENT_UNITS;
  return MEASUREMENT_UNITS.filter((unit) => getUnitFamily(unit.key) === family);
}

export function getUnitLabel(
  unitKey: string,
  language: "en" | "tr"
) {
  const unit = MEASUREMENT_UNITS.find((item) => item.key === unitKey);
  if (!unit) return unitKey;
  return language === "en" ? unit.labelEn : unit.labelTr;
}
