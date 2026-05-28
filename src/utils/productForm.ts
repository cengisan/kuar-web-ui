import { allergenIdsFromNames } from "@/config/allergens";
import { findCategoryIdByLabel } from "@/config/productCategories";
import type { ProductFormValues } from "@/components/business/ProductFormFields";
import type { Product, ProductMaterial } from "@/types";

export function createDefaultProductFormValues(): ProductFormValues {
  return {
    name: "",
    description: "",
    categoryId: "",
    customCategory: "",
    isCustomCategory: false,
    price: "",
    discount: "",
    isAvailable: true,
    isNewItem: false,
    isCampaign: false,
    isFavorite: false,
    allergenIds: [],
    stockQuantity: "",
    materials: [],
    imageFile: null,
  };
}

export function productToFormValues(product: Product): ProductFormValues {
  const categoryId = findCategoryIdByLabel(product.category || "") || "";
  const isCustomCategory = Boolean(product.category && !categoryId);

  return {
    name: product.name || "",
    description: product.description || "",
    categoryId,
    customCategory: isCustomCategory ? product.category || "" : "",
    isCustomCategory,
    price: product.price != null ? String(product.price) : "",
    discount: product.extra_parameters?.discount || "",
    isAvailable: product.is_available ?? true,
    isNewItem: product.extra_parameters?.is_new_item ?? false,
    isCampaign: product.extra_parameters?.is_campaign ?? false,
    isFavorite: product.extra_parameters?.is_favorite ?? false,
    allergenIds: allergenIdsFromNames(product.allergenNames || product.allergens),
    stockQuantity:
      product.stock_quantity != null ? String(product.stock_quantity) : "",
    materials: (product.materials || []).map((item) => ({
      material_id: item.material_id,
      material_name: item.material_name,
      quantity: item.quantity,
      unit: item.unit,
    })),
    imageFile: null,
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
    is_available: values.isAvailable,
    allergenIds: values.allergenIds,
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
  const hasCategory = values.isCustomCategory
    ? values.customCategory.trim().length > 0
    : values.categoryId.length > 0;

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

export type { ProductMaterial };
