import { allergenIdsFromNames, allergens } from "@/config/allergens";
import { findCategoryIdByLabel } from "@/config/productCategories";
import type { ProductFormValues } from "@/components/business/ProductFormFields";
import type { Product, ProductCategoryGroup, ProductMaterial } from "@/types";

export function createDefaultProductFormValues(): ProductFormValues {
  return {
    name: "",
    description: "",
    categoryId: "",
    customCategory: "",
    isCustomCategory: false,
    price: "",
    discount: "",
    calories: "",
    isAvailable: true,
    isNewItem: false,
    isCampaign: false,
    isFavorite: false,
    allergenIds: [],
    stockQuantity: "",
    materials: [],
    imageFile: null,
    imageRemoved: false,
  };
}

export function productToFormValues(
  product: Product,
  apiGroups: ProductCategoryGroup[] = []
): ProductFormValues {
  const categoryId =
    findCategoryIdByLabel(product.category || "", apiGroups) || "";
  const isCustomCategory = Boolean(product.category && !categoryId);

  return {
    name: product.name || "",
    description: product.description || "",
    categoryId,
    customCategory: isCustomCategory ? product.category || "" : "",
    isCustomCategory,
    price: product.price != null ? String(product.price) : "",
    discount: product.extra_parameters?.discount || "",
    calories: product.calories != null ? String(product.calories) : "",
    isAvailable: product.is_available ?? true,
    isNewItem: product.extra_parameters?.is_new_item ?? false,
    isCampaign: product.extra_parameters?.is_campaign ?? false,
    isFavorite: product.extra_parameters?.is_favorite ?? false,
    allergenIds: allergenIdsFromNames(
      product.allergen_names || product.allergenNames || product.allergens
    ),
    stockQuantity:
      product.stock_quantity != null ? String(product.stock_quantity) : "",
    materials: (product.materials || []).map((item) => ({
      material_id: item.material_id,
      material_name: item.material_name,
      quantity: item.quantity,
      unit: item.unit,
    })),
    imageFile: null,
    imageRemoved: false,
  };
}

export function buildProductPayload(
  values: ProductFormValues,
  options: {
    language: "en" | "tr";
    canUseStock: boolean;
    categoryLabel: string;
  }
) {
  const normalizedPrice = parseFloat(values.price.replace(",", "."));
  const discount = values.discount.trim();

  const payload: Record<string, unknown> = {
    name: values.name.trim(),
    description: values.description.trim() || null,
    category: options.categoryLabel || null,
    price: normalizedPrice,
    calories: values.calories.trim() ? parseInt(values.calories, 10) : null,
    is_available: values.isAvailable,
    allergen_ids: values.allergenIds,
    allergenIds: values.allergenIds,
    allergen_names: values.allergenIds
      .map((id) => allergens.find((item) => item.id === id)?.name)
      .filter((name): name is string => Boolean(name)),
    extra_parameters: {
      is_new_item: values.isNewItem,
      is_campaign: values.isCampaign,
      is_favorite: values.isFavorite,
      discount: discount || "0",
    },
  };

  if (options.canUseStock) {
    payload.track_stock =
      values.stockQuantity.trim() !== "" || values.materials.length > 0;
    payload.stock_quantity = values.stockQuantity.trim()
      ? parseInt(values.stockQuantity, 10)
      : null;
    payload.materials = values.materials.map((item) => ({
      material_id: item.material_id,
      quantity: item.quantity,
      unit: item.unit,
    }));
  }

  return payload;
}

export function validateProductFormValues(values: ProductFormValues) {
  const parsedPrice = parseFloat(values.price.replace(",", "."));
  const hasCategory = values.categoryId.length > 0
    || (values.isCustomCategory && values.customCategory.trim().length > 0);

  if (!values.name.trim() || !hasCategory || Number.isNaN(parsedPrice) || parsedPrice < 0) {
    return false;
  }

  if (values.discount.trim()) {
    const discountValue = parseFloat(values.discount.replace(",", "."));
    if (Number.isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
      return false;
    }
  }

  return true;
}

function normalizePrice(value: string) {
  return value.replace(",", ".").trim();
}

function normalizeMaterials(materials: ProductMaterial[]) {
  return [...materials]
    .map((item) => ({
      material_id: item.material_id,
      quantity: item.quantity,
      unit: item.unit,
    }))
    .sort((a, b) => a.material_id - b.material_id);
}

function normalizeAllergenIds(ids: number[]) {
  return [...ids].sort((a, b) => a - b);
}

export function hasProductFormChanges(
  baseline: ProductFormValues,
  current: ProductFormValues
) {
  if (current.imageFile !== null) return true;
  if (current.imageRemoved !== baseline.imageRemoved) return true;

  return (
    baseline.name.trim() !== current.name.trim() ||
    baseline.description.trim() !== current.description.trim() ||
    baseline.categoryId !== current.categoryId ||
    baseline.customCategory.trim() !== current.customCategory.trim() ||
    baseline.isCustomCategory !== current.isCustomCategory ||
    normalizePrice(baseline.price) !== normalizePrice(current.price) ||
    normalizePrice(baseline.discount) !== normalizePrice(current.discount) ||
    baseline.calories.trim() !== current.calories.trim() ||
    baseline.isAvailable !== current.isAvailable ||
    baseline.isNewItem !== current.isNewItem ||
    baseline.isCampaign !== current.isCampaign ||
    baseline.isFavorite !== current.isFavorite ||
    baseline.stockQuantity.trim() !== current.stockQuantity.trim() ||
    JSON.stringify(normalizeAllergenIds(baseline.allergenIds)) !==
      JSON.stringify(normalizeAllergenIds(current.allergenIds)) ||
    JSON.stringify(normalizeMaterials(baseline.materials)) !==
      JSON.stringify(normalizeMaterials(current.materials))
  );
}

export type { ProductMaterial };
