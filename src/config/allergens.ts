export interface Allergen {
  id: number;
  name: string;
  tr: string;
  en: string;
}

export const allergens: Allergen[] = [
  { id: 1, name: "Gluten", tr: "Gluten", en: "Gluten" },
  { id: 2, name: "Shellfish", tr: "Kabuklu Deniz Ürünleri", en: "Shellfish" },
  { id: 3, name: "Egg", tr: "Yumurta", en: "Egg" },
  { id: 4, name: "Fish", tr: "Balık", en: "Fish" },
  { id: 5, name: "Peanuts", tr: "Yer Fıstığı", en: "Peanuts" },
  { id: 6, name: "Soy", tr: "Soya", en: "Soy" },
  { id: 7, name: "Milk", tr: "Süt", en: "Milk" },
  { id: 8, name: "Nuts", tr: "Kuruyemiş", en: "Nuts" },
  { id: 9, name: "Celery", tr: "Kereviz", en: "Celery" },
  { id: 10, name: "Mustard", tr: "Hardal", en: "Mustard" },
  { id: 11, name: "Sesame", tr: "Susam", en: "Sesame" },
  { id: 12, name: "Sulphites", tr: "Sülfitler", en: "Sulphites" },
  { id: 13, name: "Legumes", tr: "Baklagiller", en: "Legumes" },
  { id: 14, name: "Molluscs", tr: "Yumuşakçalar", en: "Molluscs" },
  { id: 15, name: "Tree Nuts", tr: "Ağaç Yemişleri", en: "Tree Nuts" },
];

export function getAllergenLabel(allergen: Allergen, language: "en" | "tr") {
  return language === "en" ? allergen.en : allergen.tr;
}

export function allergenIdsFromNames(names?: string[]) {
  if (!names?.length) return [];
  return allergens.filter((a) => names.includes(a.name)).map((a) => a.id);
}
