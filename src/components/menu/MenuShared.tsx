"use client";

/**
 * Shared utilities and sub-components for all 6 menu themes.
 * Each theme file imports from here; no theme-specific logic here.
 */

import { useState, useCallback, useEffect, type CSSProperties } from "react";
import Image from "next/image";
import type {
  MenuApiData,
  ProductData,
  OrderProductOption,
  TableOption,
} from "@/types/menu";
import {
  getCurrencySymbol,
} from "@/types/menu";

// ─── Re-export types ───────────────────────────────────────────────────────────
export type { MenuApiData, ProductData };

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getApiBase(): string {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "https://kuar-test.up.railway.app/api/v1"
  );
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

export function useCurrency(data: MenuApiData): string {
  return getCurrencySymbol(data.digitalMenu.currency);
}

// ─── Allergen helpers ──────────────────────────────────────────────────────────
export function allergenDisplayName(a: string): string {
  const map: Record<string, string> = {
    Gluten: "Gluten",
    Shellfish: "Kabuklu Deniz Ürünleri",
    Egg: "Yumurta",
    Fish: "Balık",
    Peanuts: "Yer Fıstığı",
    Soy: "Soya",
    Milk: "Süt",
    "Tree Nuts": "Ağaç Yemişleri",
    Celery: "Kereviz",
    Mustard: "Hardal",
    Sesame: "Susam",
    Sulphites: "Sülfitler",
    Legumes: "Baklagiller",
    Molluscs: "Yumuşakçalar",
    Nuts: "Sert Kabuklu Yemişler",
  };
  return map[a] ?? a;
}

export function allergenLabel(a: string): string {
  return allergenDisplayName(a);
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

/** Allergen tags for product cards */
export function ProductAllergenTags({
  allergens,
  variant = "light",
}: {
  allergens: string[];
  variant?: "light" | "dark";
}) {
  if (!allergens.length) return null;
  const isDark = variant === "dark";
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
      {allergens.map((a) => (
        <span
          key={a}
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: isDark ? "rgba(220,53,69,0.12)" : "rgba(220,53,69,0.08)",
            color: isDark ? "#ff8a80" : "#c0392b",
            border: `1px solid ${isDark ? "rgba(220,53,69,0.25)" : "rgba(220,53,69,0.15)"}`,
            borderRadius: 999,
            padding: "2px 8px",
            fontSize: "0.72rem",
            fontWeight: 500,
          }}
        >
          {allergenDisplayName(a)}
        </span>
      ))}
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
  const allergens = product.allergenNames ?? [];
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

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center"
      onClick={onClose}
      style={{ background: "rgba(0,0,0,0.70)" }}
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
            <span className="text-2xl font-bold" style={{ color: accentColor }}>
              {(product.price ?? 0).toFixed(2)} {currency}
            </span>
            {product.calories != null && (
              <ProductCalorieTag calories={product.calories} />
            )}
          </div>
          {product.allergenNames && product.allergenNames.length > 0 && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
              <p className="text-xs font-semibold text-red-700 mb-2">Alerjenler</p>
              <ProductAllergenTags allergens={product.allergenNames} />
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

  const submit = async () => {
    if (!table) { setErr("Lütfen bir masa seçin."); return; }
    setErr(null);
    setSending(true);
    try {
      const res = await fetch(`${getApiBase()}/menu/${menuId}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderToken,
          tableId: Number(table),
          note: note.trim() || null,
          items: cart.map((i) => ({ productId: i.id, quantity: i.quantity })),
        }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b?.message ?? "Sipariş oluşturulamadı.");
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
    setCart([]);
    setTable("");
    setNote("");
    setErr(null);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-5 z-40 flex items-center gap-2 rounded-full px-5 py-3 font-bold text-white shadow-xl active:scale-95 transition-transform"
        style={{ background: accentColor }}
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
                  style={{ background: accentColor }}
                >✓</div>
                <h2 className="text-xl font-bold">Siparişiniz Alındı!</h2>
                <p className="text-sm opacity-70">Mutfağa iletildi. Afiyet olsun 🍽</p>
                <button onClick={reset} className="mt-2 rounded-full px-8 py-3 font-bold" style={{ background: accentColor }}>
                  Kapat
                </button>
              </div>
            ) : step === "table" ? (
              <div className="flex flex-col gap-4 px-5 pb-8 pt-3">
                <div className="flex items-center gap-3">
                  <button onClick={() => setStep("cart")} className="opacity-60 hover:opacity-100 text-lg">←</button>
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
                  className="w-full rounded-full py-3.5 font-bold text-white disabled:opacity-50"
                  style={{ background: accentColor }}
                >
                  {sending ? "Gönderiliyor..." : `Siparişi Onayla · ${total.toFixed(2)}`}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 px-4 pb-8 pt-3">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-lg font-bold">Sipariş</h2>
                  <button onClick={reset} className="opacity-50 hover:opacity-100 text-xl">✕</button>
                </div>
                <div className="flex flex-col gap-1.5 overflow-y-auto" style={{ maxHeight: "42svh" }}>
                  {orderProducts.map((p) => {
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
                          <button onClick={() => add(p)} className="h-7 w-7 flex items-center justify-center rounded-full text-sm font-bold" style={{ background: accentColor }}>+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {cart.length > 0 && (
                  <div className="rounded-2xl px-4 py-3 bg-white/8">
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
                {cart.length === 0 && <p className="text-center text-sm opacity-40 py-3">Henüz ürün eklemediniz.</p>}
                <button
                  onClick={() => cart.length > 0 && setStep("table")}
                  disabled={cart.length === 0}
                  className="w-full rounded-full py-3.5 font-bold text-white disabled:opacity-35"
                  style={{ background: accentColor }}
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
