import type { Product } from "@/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://kuar-test.up.railway.app/api/v1";

export function buildMediaUrl(raw: string | undefined | null): string | null {
  if (!raw) return null;
  if (raw.startsWith("http")) return raw;
  return raw.startsWith("/api/v1")
    ? raw.replace("/api/v1", API_BASE)
    : `${API_BASE}${raw.startsWith("/") ? raw : `/${raw}`}`;
}

export function getProductDisplayImageUrl(
  product: Partial<Product> | undefined | null
): string | null {
  if (!product) return null;
  const image = product.product_image?.[0] || product.images?.[0];
  const raw = image?.image_url || image?.url;
  return buildMediaUrl(raw);
}
