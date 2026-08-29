export const CUSTOM_CATEGORY_PREFIX = "custom:";

export interface CustomCategoryItem {
  id: string;
  label: string;
}

export function getCustomCategoriesStorageKey(
  subscriberId: number | null,
  businessId: number
) {
  return subscriberId ? `${subscriberId}:${businessId}` : String(businessId);
}

export function isCustomCategoryId(value: string) {
  return value.startsWith(CUSTOM_CATEGORY_PREFIX);
}

function slugifyLabel(label: string) {
  return (
    label
      .trim()
      .toLocaleLowerCase("tr-TR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "") || "category"
  );
}

export function createCustomCategoryId(
  label: string,
  existingIds: string[]
): string {
  const base = slugifyLabel(label);
  let id = `${CUSTOM_CATEGORY_PREFIX}${base}`;
  let counter = 1;

  while (existingIds.includes(id)) {
    id = `${CUSTOM_CATEGORY_PREFIX}${base}_${counter}`;
    counter += 1;
  }

  return id;
}

export function ensureCustomCategory(
  categories: CustomCategoryItem[],
  label: string
): CustomCategoryItem {
  const trimmed = label.trim();
  const existing = categories.find(
    (item) =>
      item.label.localeCompare(trimmed, "tr", { sensitivity: "base" }) === 0
  );

  if (existing) {
    return existing;
  }

  return {
    id: createCustomCategoryId(trimmed, categories.map((item) => item.id)),
    label: trimmed,
  };
}

export function sortCustomCategories(
  categories: CustomCategoryItem[],
  language: "en" | "tr"
) {
  const locale = language === "tr" ? "tr" : "en";
  return [...categories].sort((a, b) =>
    a.label.localeCompare(b.label, locale, { sensitivity: "base" })
  );
}

export function findCustomCategoryByLabel(
  categories: CustomCategoryItem[],
  label: string
) {
  const trimmed = label.trim();
  if (!trimmed) return null;

  return (
    categories.find(
      (item) =>
        item.label.localeCompare(trimmed, "tr", { sensitivity: "base" }) === 0
    ) ?? null
  );
}

export function findCustomCategoryById(
  categories: CustomCategoryItem[],
  categoryId: string
) {
  return categories.find((item) => item.id === categoryId) ?? null;
}
