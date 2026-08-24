export interface Allergen {
  id: number;
  name: string;
  tr: string;
  en: string;
  emoji: string;
}

export const allergens: Allergen[] = [
  { id: 1, name: "Gluten", tr: "Gluten", en: "Gluten", emoji: "🥖" },
  { id: 2, name: "Shellfish", tr: "Kabuklu Deniz Ürünleri", en: "Shellfish", emoji: "🦐" },
  { id: 3, name: "Egg", tr: "Yumurta", en: "Egg", emoji: "🥚" },
  { id: 4, name: "Fish", tr: "Balık", en: "Fish", emoji: "🐟" },
  { id: 5, name: "Peanuts", tr: "Yer Fıstığı", en: "Peanuts", emoji: "🥜" },
  { id: 6, name: "Soy", tr: "Soya", en: "Soy", emoji: "🌱" },
  { id: 7, name: "Milk", tr: "Süt", en: "Milk", emoji: "🥛" },
  { id: 8, name: "Nuts", tr: "Kuruyemiş", en: "Nuts", emoji: "🌰" },
  { id: 9, name: "Celery", tr: "Kereviz", en: "Celery", emoji: "🥬" },
  { id: 10, name: "Mustard", tr: "Hardal", en: "Mustard", emoji: "🌭" },
  { id: 11, name: "Sesame", tr: "Susam", en: "Sesame", emoji: "⚪" },
  { id: 12, name: "Sulphites", tr: "Sülfitler", en: "Sulphites", emoji: "🧪" },
  { id: 13, name: "Legumes", tr: "Baklagiller", en: "Legumes", emoji: "🫘" },
  { id: 14, name: "Molluscs", tr: "Yumuşakçalar", en: "Molluscs", emoji: "🐚" },
  { id: 15, name: "Tree Nuts", tr: "Ağaç Yemişleri", en: "Tree Nuts", emoji: "🌰" },
];

const allergenByName = new Map(allergens.map((a) => [a.name, a]));

export function getAllergenLabel(allergen: Allergen, language: "en" | "tr") {
  return language === "en" ? allergen.en : allergen.tr;
}

export function getAllergenEmoji(name: string): string {
  return allergenByName.get(name)?.emoji ?? "⚠️";
}

export function getAllergenDisplayName(name: string, language: "tr" | "en" = "tr"): string {
  const allergen = allergenByName.get(name);
  if (!allergen) return name;
  return language === "en" ? allergen.en : allergen.tr;
}

export function allergenIdsFromNames(names?: string[]) {
  if (!names?.length) return [];
  return allergens.filter((a) => names.includes(a.name)).map((a) => a.id);
}
