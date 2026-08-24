export function productsPagePath(
  businessId: number,
  category?: string | null
): string {
  const base = `/business/${businessId}/products`;
  if (!category) return base;
  return `${base}?category=${encodeURIComponent(category)}`;
}

export function editProductPath(
  businessId: number,
  productId: number,
  category?: string | null
): string {
  const base = `/business/${businessId}/products/${productId}/edit`;
  if (!category) return base;
  return `${base}?category=${encodeURIComponent(category)}`;
}

export function createProductPath(
  businessId: number,
  category?: string | null
): string {
  const base = `/business/${businessId}/products/create`;
  if (!category) return base;
  return `${base}?category=${encodeURIComponent(category)}`;
}

export function readCategoryParam(
  value: string | null | undefined
): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}
