"use client";

/**
 * Shared utilities and sub-components for all 6 menu themes.
 * Each theme file imports from here; no theme-specific logic here.
 */

import { useState, useCallback, useEffect, useMemo, type CSSProperties, type ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";
import type {
  MenuApiData,
  ProductData,
  OrderProductOption,
  TableOption,
  DigitalMenuData,
} from "@/types/menu";
import {
  getCurrencySymbol,
  getProductAllergenNames,
} from "@/types/menu";
import {
  getAllergenDisplayName,
  getAllergenEmoji,
} from "@/config/allergens";

// ─── Re-export types ───────────────────────────────────────────────────────────
export type { MenuApiData, ProductData };

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getApiBase(): string {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "https://kuar-test.up.railway.app/api/v1"
  );
}

/** Text color that reads on a solid accent/button background. */
export function contrastTextOn(accentColor: string): string {
  const hex = accentColor.trim().replace("#", "");
  if (!/^[0-9a-fA-F]{3,8}$/.test(hex)) return "#fff";
  const full =
    hex.length === 3
      ? hex.split("").map((c) => c + c).join("")
      : hex.slice(0, 6);
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? "#111111" : "#ffffff";
}

export function buildImgUrl(raw: string | undefined | null): string | null {
  if (!raw) return null;
  if (raw.startsWith("http")) return raw;
  const base = getApiBase();
  return raw.startsWith("/api/v1")
    ? raw.replace("/api/v1", base)
    : `${base}${raw}`;
}

export function firstProductImage(products: ProductData[]): string | null {
  for (const p of products) {
    const url = p.product_image?.[0]?.image_url;
    if (url) return buildImgUrl(url);
  }
  return null;
}

export type CategoryGroup = { name: string; items: ProductData[] };

export function groupCategories(products: ProductData[]): CategoryGroup[] {
  const map = new Map<string, ProductData[]>();
  for (const p of products) {
    if (!p.is_available) continue;
    const cat = p.category ?? "Diğer";
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat)!.push(p);
  }
  return Array.from(map.entries()).map(([name, items]) => ({ name, items }));
}

export type OrderCategoryGroup = { name: string; items: OrderProductOption[] };

export function groupOrderProducts(products: OrderProductOption[]): OrderCategoryGroup[] {
  const map = new Map<string, OrderProductOption[]>();
  for (const p of products) {
    const cat = p.category?.trim() || "Diğer";
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat)!.push(p);
  }
  return Array.from(map.entries()).map(([name, items]) => ({ name, items }));
}

export function useCurrency(data: MenuApiData): string {
  return getCurrencySymbol(data.digitalMenu.currency);
}

export function formatMenuLastUpdated(iso?: string | null): string | null {
  if (iso == null || String(iso).trim() === "") return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Prefer last_modified_date; fall back to created_date when null/empty. */
export function getMenuUpdatedIso(
  digitalMenu: Pick<DigitalMenuData, "last_modified_date" | "created_date"> &
    Partial<{ lastModifiedDate?: string | null; createdDate?: string | null }>,
): string | null {
  const lastModified = digitalMenu.last_modified_date ?? digitalMenu.lastModifiedDate ?? null;
  const created = digitalMenu.created_date ?? digitalMenu.createdDate ?? null;
  if (lastModified != null && String(lastModified).trim() !== "") return String(lastModified);
  if (created != null && String(created).trim() !== "") return String(created);
  return null;
}

/** Footer shown at the bottom of public menu pages. */
export function MenuLastUpdatedFooter({
  digitalMenu,
  lastModified,
  created,
  color = "#8b867e",
  background,
  borderColor,
  clearFloatingButton = true,
}: {
  digitalMenu?: Pick<DigitalMenuData, "last_modified_date" | "created_date"> &
    Partial<{ lastModifiedDate?: string | null; createdDate?: string | null }>;
  lastModified?: string | null;
  created?: string | null;
  color?: string;
  background?: string;
  borderColor?: string;
  /** Extra bottom space for the fixed order button */
  clearFloatingButton?: boolean;
}) {
  const iso = digitalMenu
    ? getMenuUpdatedIso(digitalMenu)
    : (lastModified != null && String(lastModified).trim() !== ""
        ? String(lastModified)
        : created != null && String(created).trim() !== ""
          ? String(created)
          : null);
  const formatted = formatMenuLastUpdated(iso);
  if (!formatted) return null;

  return (
    <footer
      style={{
        textAlign: "center",
        padding: clearFloatingButton ? "1rem 1.25rem 5rem" : "1rem 1.25rem",
        marginTop: "0.25rem",
        fontSize: "0.85rem",
        color,
        background: background ?? "transparent",
        borderTop: borderColor ? `1px solid ${borderColor}` : undefined,
      }}
    >
      Son güncelleme: {formatted}
    </footer>
  );
}

/**
 * Decorative header background — photo visible through overlay;
 * logo and title remain the visual focus.
 */
export function MenuHeaderBanner({
  background,
  overlay,
  minHeight = 200,
  padding = "2.5rem 1.5rem 2rem",
  textAlign = "center",
  children,
}: {
  background: StaticImageData;
  /** Solid rgba overlay — typical range 0.72–0.82 balances photo vs logo legibility */
  overlay: string;
  minHeight?: number;
  padding?: string;
  textAlign?: CSSProperties["textAlign"];
  children: ReactNode;
}) {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight,
        padding,
        textAlign,
      }}
    >
      <Image
        src={background}
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
        aria-hidden
        style={{ objectPosition: "center" }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: overlay,
        }}
        aria-hidden
      />
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
}

// ─── Allergen helpers ──────────────────────────────────────────────────────────
export function allergenDisplayName(name: string): string {
  return getAllergenDisplayName(name, "tr");
}

export function allergenLabel(name: string): string {
  return allergenDisplayName(name);
}

export function allergenEmoji(name: string): string {
  return getAllergenEmoji(name);
}

// ─── Shared product card UI ────────────────────────────────────────────────────

/** SVG placeholder for products without an image (no emoji). */
export function ProductImagePlaceholder({ size = 32, color = "#aaa" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" fill={color} stroke="none" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

const LABEL_STYLES = {
  new: { bg: "#28a745", color: "#fff" },
  campaign: { bg: "#ffc107", color: "#212529" },
  favorite: { bg: "#dc3545", color: "#fff" },
  discount: { bg: "#17a2b8", color: "#fff" },
} as const;

function ExtraLabel({ type, text }: { type: keyof typeof LABEL_STYLES; text: string }) {
  const s = LABEL_STYLES[type];
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        borderRadius: 999,
        padding: "2px 8px",
        fontSize: "0.68rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.03em",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
}

/** YENİ / KAMPANYA / FAVORİ / İNDİRİM badges */
export function ProductExtraLabels({
  product,
  layout = "inline",
}: {
  product: ProductData;
  layout?: "inline" | "overlay";
}) {
  const ep = product.extra_parameters;
  if (!ep) return null;

  const hasDiscount = ep.discount != null && ep.discount !== "" && ep.discount !== "0";
  const hasAny = ep.is_new_item || ep.is_campaign || ep.is_favorite || hasDiscount;
  if (!hasAny) return null;

  const wrapperStyle: CSSProperties =
    layout === "overlay"
      ? {
          position: "absolute",
          top: 8,
          right: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 4,
          zIndex: 7,
        }
      : { display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 };

  return (
    <div style={wrapperStyle}>
      {ep.is_new_item && <ExtraLabel type="new" text="YENİ" />}
      {ep.is_campaign && <ExtraLabel type="campaign" text="KAMPANYA" />}
      {ep.is_favorite && <ExtraLabel type="favorite" text="FAVORİ" />}
      {hasDiscount && <ExtraLabel type="discount" text={`%${ep.discount} İNDİRİM`} />}
    </div>
  );
}

export function parseDiscountPercent(discount: string | null | undefined): number | null {
  if (discount == null || discount === "" || discount === "0") return null;
  const value = parseFloat(discount.replace(",", "."));
  if (Number.isNaN(value) || value <= 0) return null;
  return value;
}

export function getProductDiscountPercent(product: ProductData): number | null {
  return parseDiscountPercent(product.extra_parameters?.discount ?? null);
}

export function applyPriceDiscount(price: number, discountPercent: number): number {
  return Math.round(price * (1 - discountPercent / 100) * 100) / 100;
}

export function getProductDisplayPrices(product: ProductData): {
  original: number | null;
  final: number | null;
  hasDiscount: boolean;
} {
  const original = product.price ?? null;
  if (original == null) return { original: null, final: null, hasDiscount: false };

  const discountPercent = getProductDiscountPercent(product);
  if (discountPercent == null) {
    return { original, final: original, hasDiscount: false };
  }

  return {
    original,
    final: applyPriceDiscount(original, discountPercent),
    hasDiscount: true,
  };
}

/** Product price with optional strikethrough original + discounted final price */
export function ProductPriceDisplay({
  product,
  currency,
  accentColor = "#c0392b",
  originalColor = "#dc3545",
  fontSize = "1rem",
  fontWeight = 700,
  style,
  className,
  currencyOnNewLine = false,
}: {
  product: ProductData;
  currency: string;
  accentColor?: string;
  originalColor?: string;
  fontSize?: string | number;
  fontWeight?: number;
  style?: CSSProperties;
  className?: string;
  currencyOnNewLine?: boolean;
}) {
  const { original, final, hasDiscount } = getProductDisplayPrices(product);
  if (final == null) return null;

  const renderAmount = (amount: number, amountStyle?: CSSProperties) => {
    if (currencyOnNewLine) {
      return (
        <>
          {amount.toFixed(2)}
          <br />
          <span style={{ fontSize: "0.75rem", fontWeight: 400 }}>{currency}</span>
        </>
      );
    }
    return (
      <>
        {amount.toFixed(2)} {currency}
      </>
    );
  };

  if (!hasDiscount || original == null) {
    return (
      <span
        className={className}
        style={{ fontWeight, fontSize, color: accentColor, ...style }}
      >
        {renderAmount(final)}
      </span>
    );
  }

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        flexWrap: "wrap",
        gap: currencyOnNewLine ? 0 : 6,
        fontSize,
        ...style,
      }}
    >
      <span
        style={{
          color: originalColor,
          textDecoration: "line-through",
          fontSize: typeof fontSize === "number" ? fontSize * 0.9 : `calc(${fontSize} * 0.9)`,
          fontWeight: 500,
        }}
      >
        {renderAmount(original)}
      </span>
      <span style={{ fontWeight, color: accentColor }}>
        {renderAmount(final)}
      </span>
    </span>
  );
}

/** Calorie badge for product cards */
export function ProductCalorieTag({
  calories,
  variant = "light",
}: {
  calories: number;
  variant?: "light" | "dark";
}) {
  const isDark = variant === "dark";
  return (
    <span
      style={{
        display: "inline-block",
        background: isDark ? "rgba(255,152,0,0.15)" : "rgba(255,152,0,0.1)",
        color: isDark ? "#ffb74d" : "#e65100",
        border: `1px solid ${isDark ? "rgba(255,152,0,0.3)" : "rgba(255,152,0,0.2)"}`,
        borderRadius: 999,
        padding: "2px 8px",
        fontSize: "0.72rem",
        fontWeight: 500,
      }}
    >
      {calories} kcal
    </span>
  );
}

/** Allergen tags for product cards and detail drawer */
export function ProductAllergenTags({
  allergens,
  variant = "light",
  showEmoji = true,
  size = "sm",
}: {
  allergens: string[];
  variant?: "light" | "dark";
  showEmoji?: boolean;
  size?: "sm" | "md";
}) {
  if (!allergens.length) return null;
  const isDark = variant === "dark";
  const isMd = size === "md";
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: isMd ? 8 : 4, marginTop: isMd ? 0 : 4 }}>
      {allergens.map((a) => (
        <span
          key={a}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: showEmoji ? 6 : 0,
            background: isDark ? "rgba(220,53,69,0.12)" : "rgba(220,53,69,0.08)",
            color: isDark ? "#ff8a80" : "#c0392b",
            border: `1px solid ${isDark ? "rgba(220,53,69,0.25)" : "rgba(220,53,69,0.15)"}`,
            borderRadius: 999,
            padding: isMd ? "6px 12px" : "2px 8px",
            fontSize: isMd ? "0.85rem" : "0.72rem",
            fontWeight: 500,
          }}
        >
          {showEmoji && <span aria-hidden>{getAllergenEmoji(a)}</span>}
          <span>{getAllergenDisplayName(a, "tr")}</span>
        </span>
      ))}
    </div>
  );
}

/** Allergen block for product detail drawer */
export function ProductAllergenSection({
  allergens,
  variant = "light",
}: {
  allergens: string[];
  variant?: "light" | "dark";
}) {
  if (!allergens.length) return null;
  const isDark = variant === "dark";
  return (
    <div
      style={{
        borderRadius: 16,
        background: isDark ? "rgba(220,53,69,0.08)" : "#fef2f2",
        border: `1px solid ${isDark ? "rgba(220,53,69,0.2)" : "#fecaca"}`,
        padding: "14px 16px",
      }}
    >
      <p
        style={{
          margin: "0 0 10px",
          fontSize: "0.8rem",
          fontWeight: 700,
          color: isDark ? "#ff8a80" : "#b91c1c",
          letterSpacing: "0.02em",
        }}
      >
        Alerjenler
      </p>
      <ProductAllergenTags allergens={allergens} variant={variant} showEmoji size="md" />
    </div>
  );
}

/** Combined meta block: labels (inline) + calorie + allergens — for card body */
export function ProductCardMeta({
  product,
  variant = "light",
  showLabels = true,
}: {
  product: ProductData;
  variant?: "light" | "dark";
  showLabels?: boolean;
}) {
  const hasCalorie = product.calories != null;
  const allergens = getProductAllergenNames(product);
  const hasAllergens = allergens.length > 0;
  const ep = product.extra_parameters;
  const hasLabels =
    showLabels &&
    ep &&
    (ep.is_new_item || ep.is_campaign || ep.is_favorite ||
      (ep.discount != null && ep.discount !== "" && ep.discount !== "0"));

  if (!hasLabels && !hasCalorie && !hasAllergens) return null;

  return (
    <div style={{ marginTop: 6 }}>
      {showLabels && <ProductExtraLabels product={product} layout="inline" />}
      {hasCalorie && (
        <div style={{ marginTop: hasLabels ? 4 : 0 }}>
          <ProductCalorieTag calories={product.calories!} variant={variant} />
        </div>
      )}
      {hasAllergens && <ProductAllergenTags allergens={allergens} variant={variant} />}
    </div>
  );
}

// ─── Product Detail Drawer ─────────────────────────────────────────────────────
interface DrawerProps {
  product: ProductData;
  currency: string;
  accentColor: string;
  onClose: () => void;
}

export function ProductDrawer({ product, currency, accentColor, onClose }: DrawerProps) {
  const imgUrl = buildImgUrl(product.product_image?.[0]?.image_url);
  const drawerAllergens = getProductAllergenNames(product);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-end justify-center"
      style={{ zIndex: 2400, background: "rgba(0,0,0,0.70)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-t-3xl bg-white overflow-y-auto"
        style={{ maxHeight: "90svh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Kapat"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white font-bold text-base"
        >
          ✕
        </button>

        {imgUrl ? (
          <div className="relative w-full" style={{ paddingTop: "56%" }}>
            <Image src={imgUrl} alt={product.name} fill className="object-cover" sizes="100vw" />
          </div>
        ) : (
          <div
            className="w-full flex items-center justify-center"
            style={{ height: 200, background: "#f5f5f5" }}
          >
            <ProductImagePlaceholder size={48} color="#ccc" />
          </div>
        )}

        <div className="px-5 py-5 pb-8">
          <ProductExtraLabels product={product} layout="inline" />

          <h2 className="text-xl font-bold text-gray-900 mb-1 mt-2">{product.name}</h2>
          {product.description && (
            <p className="text-sm text-gray-500 mb-3 leading-relaxed">{product.description}</p>
          )}
          <div className="flex items-center justify-between mb-3">
            <ProductPriceDisplay
              product={product}
              currency={currency}
              accentColor={accentColor}
              fontSize="1.5rem"
            />
            {product.calories != null && (
              <ProductCalorieTag calories={product.calories} />
            )}
          </div>
          {drawerAllergens.length > 0 && (
            <div className="mt-4">
              <ProductAllergenSection allergens={drawerAllergens} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Order Widget ──────────────────────────────────────────────────────────────
interface OrderWidgetProps {
  menuId: string;
  orderToken: string;
  tables: TableOption[];
  orderProducts: OrderProductOption[];
  accentColor: string;
  surfaceColor?: string;
}

export function OrderWidget({
  menuId,
  orderToken,
  tables,
  orderProducts,
  accentColor,
  surfaceColor = "#111",
}: OrderWidgetProps) {
  type Step = "cart" | "table" | "success";
  type CartItem = { id: number; name: string; price: number; quantity: number };

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("cart");
  const [activeOrderCategory, setActiveOrderCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [table, setTable] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = cart.reduce((s, i) => s + i.quantity, 0);

  const add = useCallback(
    (p: OrderProductOption) =>
      setCart((prev) => {
        const ex = prev.find((i) => i.id === p.id);
        return ex
          ? prev.map((i) => (i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i))
          : [...prev, { id: p.id, name: p.name, price: p.price, quantity: 1 }];
      }),
    []
  );

  const remove = useCallback(
    (id: number) =>
      setCart((prev) => {
        const ex = prev.find((i) => i.id === id);
        if (!ex) return prev;
        return ex.quantity === 1
          ? prev.filter((i) => i.id !== id)
          : prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i));
      }),
    []
  );

  const qty = (id: number) => cart.find((i) => i.id === id)?.quantity ?? 0;

  const orderCategories = useMemo(() => groupOrderProducts(orderProducts), [orderProducts]);

  const activeCategoryProducts = useMemo(() => {
    if (!activeOrderCategory) return [];
    return orderCategories.find((c) => c.name === activeOrderCategory)?.items ?? [];
  }, [activeOrderCategory, orderCategories]);

  const cartQtyInCategory = useCallback(
    (categoryName: string) => {
      const ids = new Set(
        orderCategories.find((c) => c.name === categoryName)?.items.map((p) => p.id) ?? []
      );
      return cart.reduce((sum, item) => (ids.has(item.id) ? sum + item.quantity : sum), 0);
    },
    [cart, orderCategories]
  );

  const submit = async () => {
    if (!table) { setErr("Lütfen bir masa seçin."); return; }
    setErr(null);
    setSending(true);
    try {
      const res = await fetch(`${getApiBase()}/menu/${menuId}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: orderToken,
          table_id: Number(table),
          customer_note: note.trim() || null,
          items: cart.map((i) => ({ product_id: i.id, quantity: i.quantity })),
        }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({})) as {
          message?: string;
          validation_error?: string[];
          meta?: { message?: string };
        };
        const validationMsg = Array.isArray(b.validation_error) ? b.validation_error.join(", ") : null;
        throw new Error(validationMsg ?? b.meta?.message ?? b.message ?? "Sipariş oluşturulamadı.");
      }
      setStep("success");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Bir hata oluştu.");
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    setOpen(false);
    setStep("cart");
    setActiveOrderCategory(null);
    setCart([]);
    setTable("");
    setNote("");
    setErr(null);
  };

  const openWidget = () => {
    setActiveOrderCategory(null);
    setOpen(true);
  };

  const onAccentText = contrastTextOn(accentColor);

  return (
    <>
      <button
        onClick={openWidget}
        className="fixed bottom-6 right-5 z-40 flex items-center gap-2 rounded-full px-5 py-3 font-bold shadow-xl active:scale-95 transition-transform"
        style={{ background: accentColor, color: onAccentText }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
        <span className="text-sm">
          {count > 0 ? `${count} ürün · ${total.toFixed(2)}` : "Sipariş ver"}
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={(e) => e.target === e.currentTarget && reset()}
        >
          <div
            className="relative w-full max-w-lg rounded-t-3xl overflow-y-auto text-white"
            style={{ background: surfaceColor, maxHeight: "88svh" }}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-white/20" />
            </div>

            {step === "success" ? (
              <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
                <div
                  className="h-16 w-16 flex items-center justify-center rounded-full text-3xl"
                  style={{ background: accentColor, color: onAccentText }}
                >✓</div>
                <h2 className="text-xl font-bold">Siparişiniz Alındı!</h2>
                <p className="text-sm opacity-70">Mutfağa iletildi. Afiyet olsun 🍽</p>
                <button onClick={reset} className="mt-2 rounded-full px-8 py-3 font-bold" style={{ background: accentColor, color: onAccentText }}>
                  Kapat
                </button>
              </div>
            ) : step === "table" ? (
              <div className="flex flex-col gap-4 px-5 pb-8 pt-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setStep("cart"); setActiveOrderCategory(null); }}
                    className="opacity-60 hover:opacity-100 text-lg"
                  >
                    ←
                  </button>
                  <h2 className="text-lg font-bold">Masa Seç</h2>
                </div>
                <select
                  value={table}
                  onChange={(e) => setTable(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 text-sm bg-white/10 border-white/20 text-white"
                >
                  <option value="">Masa seçin...</option>
                  {tables.map((t) => (
                    <option key={t.id} value={String(t.id)}>{t.tableNumber}</option>
                  ))}
                </select>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Özel istek..."
                  rows={3}
                  className="w-full resize-none rounded-xl border px-4 py-3 text-sm bg-white/10 border-white/20 text-white placeholder-white/40"
                />
                {err && <p className="rounded-xl bg-red-500/20 px-4 py-3 text-sm text-red-300">{err}</p>}
                <button
                  onClick={submit}
                  disabled={sending}
                  className="w-full rounded-full py-3.5 font-bold disabled:opacity-50"
                  style={{ background: accentColor, color: onAccentText }}
                >
                  {sending ? "Gönderiliyor..." : `Siparişi Onayla · ${total.toFixed(2)}`}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 px-4 pb-8 pt-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2 min-w-0">
                    {activeOrderCategory && (
                      <button
                        type="button"
                        onClick={() => setActiveOrderCategory(null)}
                        className="opacity-60 hover:opacity-100 text-lg shrink-0"
                        aria-label="Kategorilere dön"
                      >
                        ←
                      </button>
                    )}
                    <h2 className="text-lg font-bold truncate">
                      {activeOrderCategory ?? "Kategori Seçin"}
                    </h2>
                  </div>
                  <button onClick={reset} className="opacity-50 hover:opacity-100 text-xl shrink-0">✕</button>
                </div>

                <div className="flex flex-col gap-1.5 overflow-y-auto" style={{ maxHeight: "42svh" }}>
                  {!activeOrderCategory ? (
                    orderCategories.map((cat) => {
                      const inCart = cartQtyInCategory(cat.name);
                      return (
                        <button
                          key={cat.name}
                          type="button"
                          onClick={() => setActiveOrderCategory(cat.name)}
                          className="flex items-center gap-3 rounded-2xl px-4 py-3 bg-white/10 text-left w-full"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-semibold">{cat.name}</p>
                            <p className="text-xs opacity-50">{cat.items.length} ürün</p>
                          </div>
                          {inCart > 0 && (
                            <span
                              className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold"
                              style={{ background: accentColor, color: onAccentText }}
                            >
                              {inCart}
                            </span>
                          )}
                          <span className="opacity-40 text-sm shrink-0">→</span>
                        </button>
                      );
                    })
                  ) : (
                    activeCategoryProducts.map((p) => {
                      const q = qty(p.id);
                      return (
                        <div key={p.id} className="flex items-center gap-3 rounded-2xl px-4 py-3 bg-white/10">
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-semibold">{p.name}</p>
                            <p className="text-xs opacity-50">{p.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => remove(p.id)} disabled={q === 0} className="h-7 w-7 flex items-center justify-center rounded-full bg-white/15 text-sm font-bold disabled:opacity-25">−</button>
                            <span className="w-5 text-center text-sm font-bold">{q}</span>
                            <button onClick={() => add(p)} className="h-7 w-7 flex items-center justify-center rounded-full text-sm font-bold" style={{ background: accentColor, color: onAccentText }}>+</button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {!activeOrderCategory && orderCategories.length === 0 && (
                  <p className="text-center text-sm opacity-40 py-3">Sipariş verilebilir ürün bulunamadı.</p>
                )}

                {activeOrderCategory && activeCategoryProducts.length === 0 && (
                  <p className="text-center text-sm opacity-40 py-3">Bu kategoride ürün yok.</p>
                )}

                {cart.length > 0 && (
                  <div className="rounded-2xl px-4 py-3 bg-white/8">
                    <p className="text-xs font-semibold opacity-60 mb-1.5">Sepetiniz</p>
                    {cart.map((i) => (
                      <div key={i.id} className="flex justify-between text-sm py-0.5">
                        <span className="opacity-80">{i.quantity}× {i.name}</span>
                        <span className="font-semibold">{(i.price * i.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="mt-2 pt-2 border-t border-white/15 flex justify-between font-bold">
                      <span>Toplam</span><span>{total.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {cart.length === 0 && (
                  <p className="text-center text-sm opacity-40 py-3">
                    {activeOrderCategory
                      ? "Ürün eklemek için + butonuna dokunun."
                      : "Başlamak için bir kategori seçin."}
                  </p>
                )}

                {activeOrderCategory && (
                  <button
                    type="button"
                    onClick={() => setActiveOrderCategory(null)}
                    className="w-full rounded-full py-2.5 text-sm font-semibold bg-white/10"
                  >
                    Başka Kategori Seç
                  </button>
                )}

                <button
                  onClick={() => cart.length > 0 && setStep("table")}
                  disabled={cart.length === 0}
                  className="w-full rounded-full py-3.5 font-bold disabled:opacity-35"
                  style={{ background: accentColor, color: onAccentText }}
                >
                  Devam Et ({count} ürün)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
