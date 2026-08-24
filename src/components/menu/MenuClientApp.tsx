"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import type { MenuApiData, ProductData, OrderProductOption, TableOption } from "@/types/menu";
import { getCurrencySymbol, normalizeCategory, CATEGORY_IMAGE_MAP } from "@/types/menu";

// ─── Theme variant contract ────────────────────────────────────────────────────
export interface MenuThemeVariant {
  /** Unique ID matching the backend theme string */
  id: string;
  /** App-level background (can be any CSS value, e.g. a fixed gradient) */
  bodyBg: string;
  bodyBgFixed?: boolean;

  /** Header area */
  headerBg: string;
  headerBgImage?: string;
  headerOverlay?: string;
  headerText: string;
  headerSubtext: string;
  logoRingColor: string;

  /** Category grid tiles */
  tileGradients: string[];        // per-index gradient fallback strings
  tileOverlay: string;            // translucent overlay on image tiles
  tileTextColor: string;
  tileFeaturedAccent?: string;    // accent color for the "featured" (first) tile

  /** Product layout style */
  productLayout: "grid" | "list-hero" | "list-text" | "list-thumbnail";
  dotLeader?: boolean;            // dotted leader line for classic menu (list-text)

  /** Cards / surface */
  cardBg: string;
  cardBorder: string;
  cardShadow: string;

  /** Text */
  text: string;
  textMuted: string;
  accent: string;
  accentContrast: string;         // text color on the accent

  /** Nav (back bar inside category view) */
  navBg: string;
  navBorder: string;
  navText: string;

  /** Back-button pill */
  backBtnBg: string;
  backBtnText: string;

  /** Fonts */
  fontFamily: string;
  headingFont?: string;

  /** Shape */
  radius: string;

  /** Order widget */
  orderAccent: string;
  orderSurface: string;
  orderText: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getApiBase(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://kuar-test.up.railway.app/api/v1";
}

function buildImageUrl(raw: string | undefined | null): string | null {
  if (!raw) return null;
  if (raw.startsWith("http")) return raw;
  const base = getApiBase();
  return raw.startsWith("/api/v1") ? raw.replace("/api/v1", base) : `${base}${raw}`;
}

function getCategoryTileImage(products: ProductData[]): string | null {
  for (const p of products) {
    const url = p.product_image?.[0]?.image_url;
    if (url) return buildImageUrl(url);
  }
  return null;
}

function getCategoryDefaultImage(catName: string): string | null {
  const key = normalizeCategory(catName);
  const rel = CATEGORY_IMAGE_MAP[key];
  if (!rel) return null;
  return buildImageUrl(rel);
}

function groupCategories(products: ProductData[]): { name: string; items: ProductData[] }[] {
  const map = new Map<string, ProductData[]>();
  for (const p of products) {
    const cat = p.category ?? "Diğer";
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat)!.push(p);
  }
  return Array.from(map.entries()).map(([name, items]) => ({ name, items }));
}

// Bento layout: full / half-half / full / half-half …
function bentoIndex(i: number): "full" | "half" {
  const pos = i % 3;
  return pos === 0 ? "full" : "half";
}

// ─── Product detail drawer ─────────────────────────────────────────────────────
interface ProductDrawerProps {
  product: ProductData;
  currency: string;
  theme: MenuThemeVariant;
  onClose: () => void;
}

function ProductDrawer({ product, currency, theme, onClose }: ProductDrawerProps) {
  const imgUrl = buildImageUrl(product.product_image?.[0]?.image_url);
  const price = product.price ?? 0;
  const ep = product.extra_parameters;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center"
      onClick={onClose}
      style={{ background: "rgba(0,0,0,0.72)" }}
    >
      <div
        className="relative w-full max-w-lg rounded-t-3xl overflow-hidden"
        style={{ background: theme.cardBg, maxHeight: "92svh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold"
          style={{ background: "rgba(0,0,0,0.45)", color: "#fff" }}
          aria-label="Kapat"
        >
          ✕
        </button>

        {/* Product image */}
        {imgUrl ? (
          <div className="relative w-full" style={{ paddingTop: "56%" }}>
            <Image
              src={imgUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        ) : (
          <div
            className="w-full flex items-center justify-center"
            style={{
              height: 200,
              background: theme.tileGradients[0] ?? "#1a1a1a",
            }}
          >
            <span className="text-5xl opacity-30">🍽</span>
          </div>
        )}

        {/* Content */}
        <div className="px-5 py-5 pb-8" style={{ fontFamily: theme.fontFamily }}>
          {/* Labels */}
          {ep && (ep.is_new_item || ep.is_campaign || ep.is_favorite) && (
            <div className="flex gap-2 mb-3 flex-wrap">
              {ep.is_new_item && (
                <span className="rounded-full px-3 py-0.5 text-xs font-bold" style={{ background: "#22c55e", color: "#fff" }}>
                  YENİ
                </span>
              )}
              {ep.is_campaign && (
                <span className="rounded-full px-3 py-0.5 text-xs font-bold" style={{ background: "#f59e0b", color: "#fff" }}>
                  KAMPANYA
                </span>
              )}
              {ep.is_favorite && (
                <span className="rounded-full px-3 py-0.5 text-xs font-bold" style={{ background: "#ec4899", color: "#fff" }}>
                  ❤ FAVORİ
                </span>
              )}
              {ep.discount && (
                <span className="rounded-full px-3 py-0.5 text-xs font-bold" style={{ background: "#ef4444", color: "#fff" }}>
                  %{ep.discount} İNDİRİM
                </span>
              )}
            </div>
          )}

          <h2
            className="text-xl font-bold leading-tight mb-1"
            style={{ color: theme.text, fontFamily: theme.headingFont ?? theme.fontFamily }}
          >
            {product.name}
          </h2>

          {product.description && (
            <p className="text-sm mb-3 leading-relaxed" style={{ color: theme.textMuted }}>
              {product.description}
            </p>
          )}

          {/* Price + extras */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold" style={{ color: theme.accent }}>
              {price.toFixed(2)} {currency}
            </span>
            {product.calories != null && (
              <span className="text-xs rounded-full px-3 py-1" style={{ background: theme.cardBorder, color: theme.textMuted }}>
                {product.calories} kal
              </span>
            )}
          </div>

          {/* Allergens */}
          {product.allergenNames && product.allergenNames.length > 0 && (
            <div
              className="rounded-2xl px-4 py-3 text-xs"
              style={{ background: "rgba(251,191,36,0.12)", color: "#d97706" }}
            >
              <span className="font-semibold">⚠ Alerjenler: </span>
              {product.allergenNames.join(", ")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Product card (grid) ──────────────────────────────────────────────────────
function ProductCard({
  product,
  currency,
  theme,
  onClick,
}: {
  product: ProductData;
  currency: string;
  theme: MenuThemeVariant;
  onClick: () => void;
}) {
  const imgUrl = buildImageUrl(product.product_image?.[0]?.image_url);
  const ep = product.extra_parameters;

  return (
    <div
      className="flex flex-col overflow-hidden cursor-pointer transition-transform active:scale-95"
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.cardBorder}`,
        borderRadius: theme.radius,
        boxShadow: theme.cardShadow,
      }}
    >
      {/* Image */}
      <button
        className="relative w-full overflow-hidden"
        style={{ paddingTop: "65%", borderRadius: `${theme.radius} ${theme.radius} 0 0` }}
        onClick={onClick}
        aria-label={`${product.name} detayını gör`}
      >
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 640px) 50vw, 33vw"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-4xl opacity-20"
            style={{ background: theme.tileGradients[0] }}
          >
            🍽
          </div>
        )}
        {/* Badge labels */}
        {ep?.is_new_item && (
          <span className="absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-bold"
            style={{ background: "#22c55e", color: "#fff" }}>YENİ</span>
        )}
        {ep?.is_campaign && (
          <span className="absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-bold"
            style={{ background: "#f59e0b", color: "#fff" }}>KAMPANYA</span>
        )}
      </button>

      {/* Info */}
      <div className="flex flex-col gap-1 p-3">
        <p className="text-sm font-semibold leading-tight line-clamp-2"
          style={{ color: theme.text, fontFamily: theme.headingFont ?? theme.fontFamily }}>
          {product.name}
        </p>
        {product.description && (
          <p className="text-xs line-clamp-2" style={{ color: theme.textMuted }}>
            {product.description}
          </p>
        )}
        <p className="text-sm font-bold mt-1" style={{ color: theme.accent }}>
          {(product.price ?? 0).toFixed(2)} {currency}
        </p>
      </div>
    </div>
  );
}

// ─── Product list-hero (Carbone style) ────────────────────────────────────────
function ProductListHero({
  products,
  currency,
  theme,
  onProductClick,
}: {
  products: ProductData[];
  currency: string;
  theme: MenuThemeVariant;
  onProductClick: (p: ProductData) => void;
}) {
  const [hero, ...rest] = products;

  return (
    <div className="flex flex-col gap-3">
      {/* Hero card */}
      {hero && (
        <button
          className="relative w-full overflow-hidden text-left"
          style={{ borderRadius: theme.radius, paddingTop: "55%" }}
          onClick={() => onProductClick(hero)}
        >
          {buildImageUrl(hero.product_image?.[0]?.image_url) ? (
            <Image
              src={buildImageUrl(hero.product_image![0].image_url)!}
              alt={hero.name}
              fill
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0" style={{ background: theme.tileGradients[0] }} />
          )}
          <div
            className="absolute inset-0 flex flex-col justify-end p-4"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)" }}
          >
            <p className="text-white font-bold text-lg leading-tight">{hero.name}</p>
            {hero.description && (
              <p className="text-white/70 text-xs mt-0.5 line-clamp-2">{hero.description}</p>
            )}
            <p className="text-white font-bold mt-1">{(hero.price ?? 0).toFixed(2)} {currency}</p>
          </div>
        </button>
      )}

      {/* Thumbnail list */}
      {rest.map((p) => {
        const imgUrl = buildImageUrl(p.product_image?.[0]?.image_url);
        return (
          <button
            key={p.id}
            className="flex items-center gap-3 text-left w-full p-3"
            style={{
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: theme.radius,
            }}
            onClick={() => onProductClick(p)}
          >
            {imgUrl ? (
              <div className="relative flex-shrink-0" style={{ width: 72, height: 72, borderRadius: 12, overflow: "hidden" }}>
                <Image src={imgUrl} alt={p.name} fill className="object-cover" sizes="72px" />
              </div>
            ) : (
              <div
                className="flex-shrink-0 flex items-center justify-center text-2xl opacity-30"
                style={{ width: 72, height: 72, borderRadius: 12, background: theme.tileGradients[1] ?? theme.cardBorder }}
              >🍽</div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm leading-tight" style={{ color: theme.text }}>{p.name}</p>
              {p.description && (
                <p className="text-xs mt-0.5 line-clamp-2" style={{ color: theme.textMuted }}>{p.description}</p>
              )}
            </div>
            <p className="flex-shrink-0 font-bold text-sm ml-1" style={{ color: theme.accent }}>
              {(p.price ?? 0).toFixed(2)}<br /><span className="text-xs font-normal">{currency}</span>
            </p>
          </button>
        );
      })}
    </div>
  );
}

// ─── Product list-text (Murad's dotted style) ─────────────────────────────────
function ProductListText({
  products,
  currency,
  theme,
  onProductClick,
}: {
  products: ProductData[];
  currency: string;
  theme: MenuThemeVariant;
  onProductClick: (p: ProductData) => void;
}) {
  return (
    <div className="flex flex-col">
      {products.map((p, i) => (
        <button
          key={p.id}
          className="flex flex-col text-left py-3 w-full"
          style={{
            borderBottom: i < products.length - 1
              ? `1px dashed ${theme.cardBorder}`
              : "none",
          }}
          onClick={() => onProductClick(p)}
        >
          <div className="flex items-baseline gap-1 w-full">
            <span className="font-semibold text-sm leading-snug flex-shrink-0"
              style={{ color: theme.accent, fontFamily: theme.headingFont ?? theme.fontFamily }}>
              {p.name}
            </span>
            {theme.dotLeader && (
              <span
                className="flex-1 mx-1 overflow-hidden"
                style={{ borderBottom: `2px dotted ${theme.cardBorder}`, marginBottom: 3 }}
              />
            )}
            <span className="flex-shrink-0 font-bold text-sm" style={{ color: theme.text }}>
              {(p.price ?? 0).toFixed(2)} {currency}
            </span>
          </div>
          {p.description && (
            <p className="text-xs mt-0.5" style={{ color: theme.textMuted }}>{p.description}</p>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Product list-thumbnail (horizontal rows with image) ──────────────────────
function ProductListThumbnail({
  products,
  currency,
  theme,
  onProductClick,
}: {
  products: ProductData[];
  currency: string;
  theme: MenuThemeVariant;
  onProductClick: (p: ProductData) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {products.map((p) => {
        const imgUrl = buildImageUrl(p.product_image?.[0]?.image_url);
        return (
          <button
            key={p.id}
            className="flex items-center gap-3 text-left w-full p-3"
            style={{
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: theme.radius,
              boxShadow: theme.cardShadow,
            }}
            onClick={() => onProductClick(p)}
          >
            {imgUrl ? (
              <div className="relative flex-shrink-0" style={{ width: 64, height: 64, borderRadius: 10, overflow: "hidden" }}>
                <Image src={imgUrl} alt={p.name} fill className="object-cover" sizes="64px" />
              </div>
            ) : (
              <div
                className="flex-shrink-0 flex items-center justify-center text-xl opacity-30"
                style={{ width: 64, height: 64, borderRadius: 10, background: theme.cardBorder }}
              >🍽</div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm" style={{ color: theme.text, fontFamily: theme.headingFont ?? theme.fontFamily }}>
                {p.name}
              </p>
              {p.description && (
                <p className="text-xs mt-0.5 line-clamp-2" style={{ color: theme.textMuted }}>{p.description}</p>
              )}
            </div>
            <p className="flex-shrink-0 text-sm font-bold" style={{ color: theme.accent }}>
              {(p.price ?? 0).toFixed(2)} {currency}
            </p>
          </button>
        );
      })}
    </div>
  );
}

// ─── Order widget (floating) ───────────────────────────────────────────────────
interface OrderWidgetProps {
  menuId: string;
  orderToken: string;
  tables: TableOption[];
  orderProducts: OrderProductOption[];
  theme: MenuThemeVariant;
}

function OrderWidget({ menuId, orderToken, tables, orderProducts, theme }: OrderWidgetProps) {
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

  const add = useCallback((p: OrderProductOption) =>
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      return ex
        ? prev.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { id: p.id, name: p.name, price: p.price, quantity: 1 }];
    }), []);

  const remove = useCallback((id: number) =>
    setCart(prev => {
      const ex = prev.find(i => i.id === id);
      if (!ex) return prev;
      return ex.quantity === 1 ? prev.filter(i => i.id !== id) : prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
    }), []);

  const qty = (id: number) => cart.find(i => i.id === id)?.quantity ?? 0;

  const submit = async () => {
    if (!table) { setErr("Lütfen bir masa seçin."); return; }
    setErr(null); setSending(true);
    try {
      const res = await fetch(`${getApiBase()}/menu/${menuId}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderToken, tableId: Number(table), note: note.trim() || null, items: cart.map(i => ({ productId: i.id, quantity: i.quantity })) }),
      });
      if (!res.ok) { const b = await res.json().catch(() => ({})); throw new Error(b?.message ?? "Sipariş oluşturulamadı."); }
      setStep("success");
    } catch (e) { setErr(e instanceof Error ? e.message : "Bir hata oluştu."); }
    finally { setSending(false); }
  };

  const reset = () => { setOpen(false); setStep("cart"); setCart([]); setTable(""); setNote(""); setErr(null); };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-5 z-40 flex items-center gap-2 rounded-full px-5 py-3 font-bold shadow-2xl transition-all active:scale-95"
        style={{ background: theme.orderAccent, color: theme.orderText }}
        aria-label="Sipariş ver"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
        <span className="text-sm">{count > 0 ? `${count} ürün · ${total.toFixed(2)}` : "Sipariş ver"}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.65)" }} onClick={e => e.target === e.currentTarget && reset()}>
          <div className="relative w-full max-w-lg rounded-t-3xl overflow-y-auto" style={{ background: theme.orderSurface, color: theme.orderText, maxHeight: "88svh" }}>
            <div className="flex justify-center pt-3 pb-1"><div className="h-1 w-10 rounded-full" style={{ background: "rgba(128,128,128,0.4)" }} /></div>

            {step === "success" ? (
              <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full text-3xl" style={{ background: theme.orderAccent, color: theme.orderText }}>✓</div>
                <h2 className="text-xl font-bold">Siparişiniz Alındı!</h2>
                <p className="text-sm opacity-70">Siparişiniz mutfağa iletildi. Afiyet olsun 🍽</p>
                <button onClick={reset} className="mt-2 rounded-full px-8 py-3 font-bold" style={{ background: theme.orderAccent, color: theme.orderText }}>Kapat</button>
              </div>
            ) : step === "table" ? (
              <div className="flex flex-col gap-4 px-5 pb-8 pt-3">
                <div className="flex items-center gap-3">
                  <button onClick={() => setStep("cart")} className="opacity-60 hover:opacity-100 text-lg">←</button>
                  <h2 className="text-lg font-bold">Masa ve Not</h2>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium opacity-75">Masa *</label>
                  <select value={table} onChange={e => setTable(e.target.value)} className="w-full rounded-xl border px-4 py-3 text-sm" style={{ background: "rgba(128,128,128,0.12)", borderColor: "rgba(128,128,128,0.25)", color: "inherit" }}>
                    <option value="">Seçin...</option>
                    {tables.map(t => <option key={t.id} value={String(t.id)}>{t.tableNumber}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium opacity-75">Not</label>
                  <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Özel istek..." rows={3} className="w-full resize-none rounded-xl border px-4 py-3 text-sm" style={{ background: "rgba(128,128,128,0.12)", borderColor: "rgba(128,128,128,0.25)", color: "inherit" }} />
                </div>
                {err && <p className="rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-400">{err}</p>}
                <button onClick={submit} disabled={sending} className="w-full rounded-full py-3.5 font-bold transition-opacity disabled:opacity-50" style={{ background: theme.orderAccent, color: theme.orderText }}>
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
                  {orderProducts.map(p => {
                    const q = qty(p.id);
                    return (
                      <div key={p.id} className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: "rgba(128,128,128,0.1)" }}>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-semibold">{p.name}</p>
                          <p className="text-xs opacity-55">{p.price.toFixed(2)} {""}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => remove(p.id)} disabled={q === 0} className="h-7 w-7 flex items-center justify-center rounded-full text-sm font-bold disabled:opacity-25" style={{ background: "rgba(128,128,128,0.2)" }}>−</button>
                          <span className="w-5 text-center text-sm font-bold">{q}</span>
                          <button onClick={() => add(p)} className="h-7 w-7 flex items-center justify-center rounded-full text-sm font-bold" style={{ background: theme.orderAccent, color: theme.orderText }}>+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {cart.length > 0 && (
                  <div className="rounded-2xl px-4 py-3" style={{ background: "rgba(128,128,128,0.08)" }}>
                    {cart.map(i => (
                      <div key={i.id} className="flex justify-between text-sm py-0.5">
                        <span className="opacity-80">{i.quantity}× {i.name}</span>
                        <span className="font-semibold">{(i.price * i.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="mt-2 pt-2 border-t flex justify-between font-bold" style={{ borderColor: "rgba(128,128,128,0.2)" }}>
                      <span>Toplam</span><span>{total.toFixed(2)}</span>
                    </div>
                  </div>
                )}
                {cart.length === 0 && <p className="text-center text-sm opacity-40 py-3">Henüz ürün eklemediniz.</p>}
                <button onClick={() => cart.length > 0 && setStep("table")} disabled={cart.length === 0} className="w-full rounded-full py-3.5 font-bold transition-opacity disabled:opacity-35" style={{ background: theme.orderAccent, color: theme.orderText }}>
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

// ─── Main MenuClientApp ────────────────────────────────────────────────────────
interface MenuClientAppProps {
  menuId: string;
  data: MenuApiData;
  theme: MenuThemeVariant;
}

export function MenuClientApp({ menuId, data, theme }: MenuClientAppProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeProduct, setActiveProduct] = useState<ProductData | null>(null);

  const currency = getCurrencySymbol(data.digitalMenu.currency);
  const categories = groupCategories(data.products);
  const logoImg = buildImageUrl(data.digitalMenu.digital_menu_image?.[0]?.image_url);

  const activeCatProducts = activeCategory
    ? (categories.find(c => c.name === activeCategory)?.items ?? [])
    : [];

  // Body background style
  const bodyStyle: React.CSSProperties = theme.bodyBgFixed
    ? { background: theme.bodyBg, backgroundAttachment: "fixed", minHeight: "100svh" }
    : { background: theme.bodyBg, minHeight: "100svh" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&family=Oswald:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; }
      `}</style>

      <div style={{ ...bodyStyle, fontFamily: theme.fontFamily }}>

        {/* ── CATEGORY VIEW (after selecting a category) ── */}
        {activeCategory !== null && (
          <div className="flex flex-col min-h-svh">
            {/* Category header with back navigation */}
            <div
              className="relative flex-shrink-0"
              style={{ background: theme.navBg, borderBottom: `1px solid ${theme.navBorder}` }}
            >
              {/* Hero image from first product in category */}
              {(() => {
                const heroImg = getCategoryTileImage(activeCatProducts);
                return heroImg ? (
                  <div className="relative w-full" style={{ paddingTop: "42%" }}>
                    <Image src={heroImg} alt={activeCategory} fill className="object-cover" sizes="100vw" />
                    <div className="absolute inset-0" style={{ background: theme.tileOverlay }} />
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-5 px-4">
                      <button
                        onClick={() => setActiveCategory(null)}
                        className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold"
                        style={{ background: theme.backBtnBg, color: theme.backBtnText }}
                      >
                        ← Menüye Dön
                      </button>
                      <h1
                        className="text-2xl font-bold text-white text-center uppercase tracking-wide"
                        style={{ fontFamily: theme.headingFont ?? theme.fontFamily, textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}
                      >
                        {activeCategory}
                      </h1>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 px-4 py-4">
                    <button
                      onClick={() => setActiveCategory(null)}
                      className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold"
                      style={{ background: theme.backBtnBg, color: theme.backBtnText }}
                    >
                      ← Geri
                    </button>
                    <h1
                      className="text-xl font-bold"
                      style={{ color: theme.headerText, fontFamily: theme.headingFont ?? theme.fontFamily }}
                    >
                      {activeCategory}
                    </h1>
                  </div>
                );
              })()}
            </div>

            {/* Product list */}
            <div className="flex-1 px-4 py-5">
              {theme.productLayout === "grid" && (
                <div className="grid grid-cols-2 gap-3">
                  {activeCatProducts.map(p => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      currency={currency}
                      theme={theme}
                      onClick={() => setActiveProduct(p)}
                    />
                  ))}
                </div>
              )}
              {theme.productLayout === "list-hero" && (
                <ProductListHero
                  products={activeCatProducts}
                  currency={currency}
                  theme={theme}
                  onProductClick={setActiveProduct}
                />
              )}
              {theme.productLayout === "list-text" && (
                <div
                  className="rounded-3xl px-5 py-4"
                  style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
                >
                  <ProductListText
                    products={activeCatProducts}
                    currency={currency}
                    theme={theme}
                    onProductClick={setActiveProduct}
                  />
                </div>
              )}
              {theme.productLayout === "list-thumbnail" && (
                <ProductListThumbnail
                  products={activeCatProducts}
                  currency={currency}
                  theme={theme}
                  onProductClick={setActiveProduct}
                />
              )}
            </div>
          </div>
        )}

        {/* ── HOME VIEW (category tiles) ── */}
        {activeCategory === null && (
          <div className="flex flex-col min-h-svh">
            {/* Header */}
            <header
              className="relative flex-shrink-0 flex flex-col items-center justify-end overflow-hidden pb-6 pt-10"
              style={{
                background: theme.headerBgImage ? undefined : theme.headerBg,
                minHeight: 220,
              }}
            >
              {theme.headerBgImage && (
                <Image
                  src={theme.headerBgImage}
                  alt="background"
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              )}
              {(theme.headerBgImage || theme.headerOverlay) && (
                <div className="absolute inset-0" style={{ background: theme.headerOverlay ?? "rgba(0,0,0,0.55)" }} />
              )}

              <div className="relative z-10 flex flex-col items-center gap-3">
                {/* Logo */}
                {logoImg ? (
                  <div
                    className="relative overflow-hidden"
                    style={{
                      width: 88,
                      height: 88,
                      borderRadius: "50%",
                      border: `3px solid ${theme.logoRingColor}`,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                    }}
                  >
                    <Image src={logoImg} alt={data.name} fill className="object-cover" sizes="88px" />
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-center text-3xl"
                    style={{
                      width: 88,
                      height: 88,
                      borderRadius: "50%",
                      border: `3px solid ${theme.logoRingColor}`,
                      background: "rgba(255,255,255,0.12)",
                      color: theme.headerText,
                    }}
                  >
                    🍽
                  </div>
                )}

                {/* Restaurant name */}
                <div className="text-center px-4">
                  <h1
                    className="text-2xl font-bold leading-tight"
                    style={{ color: theme.headerText, fontFamily: theme.headingFont ?? theme.fontFamily }}
                  >
                    {data.name}
                  </h1>
                  {data.digitalMenu.business_name && data.digitalMenu.business_name !== data.name && (
                    <p className="text-sm mt-0.5" style={{ color: theme.headerSubtext }}>
                      {data.digitalMenu.business_name}
                    </p>
                  )}
                </div>
              </div>
            </header>

            {/* Category bento grid */}
            <main className="flex-1 px-3 py-4">
              <div className="flex flex-col gap-3">
                {(() => {
                  const tiles: React.ReactNode[] = [];
                  let i = 0;
                  while (i < categories.length) {
                    const isGroupStart = i % 3 === 0;

                    if (isGroupStart) {
                      // Full-width tile
                      const cat = categories[i];
                      const img = getCategoryTileImage(cat.items) ?? getCategoryDefaultImage(cat.name);
                      const gradient = theme.tileGradients[i % theme.tileGradients.length];

                      tiles.push(
                        <button
                          key={cat.name}
                          className="relative w-full overflow-hidden text-left"
                          style={{ borderRadius: theme.radius, paddingTop: "45%", minHeight: 160 }}
                          onClick={() => setActiveCategory(cat.name)}
                          aria-label={cat.name}
                        >
                          {img ? (
                            <Image src={img} alt={cat.name} fill className="object-cover" sizes="100vw" />
                          ) : (
                            <div className="absolute inset-0" style={{ background: gradient }} />
                          )}
                          <div className="absolute inset-0" style={{ background: theme.tileOverlay }} />
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                            <span
                              className="font-bold text-xl tracking-widest uppercase px-3 text-center"
                              style={{ color: theme.tileTextColor, fontFamily: theme.headingFont ?? theme.fontFamily, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
                            >
                              {cat.name}
                            </span>
                            <span className="text-xs uppercase tracking-wider" style={{ color: `${theme.tileTextColor}99` }}>
                              {cat.items.length} ürün
                            </span>
                          </div>
                        </button>
                      );
                      i++;
                    } else {
                      // Two half-width tiles
                      const pair = categories.slice(i, i + 2);
                      tiles.push(
                        <div key={`pair-${i}`} className="grid grid-cols-2 gap-3">
                          {pair.map((cat, pi) => {
                            const img = getCategoryTileImage(cat.items) ?? getCategoryDefaultImage(cat.name);
                            const gradient = theme.tileGradients[(i + pi) % theme.tileGradients.length];
                            return (
                              <button
                                key={cat.name}
                                className="relative overflow-hidden text-left"
                                style={{ borderRadius: theme.radius, paddingTop: "90%", minHeight: 130 }}
                                onClick={() => setActiveCategory(cat.name)}
                                aria-label={cat.name}
                              >
                                {img ? (
                                  <Image src={img} alt={cat.name} fill className="object-cover" sizes="50vw" />
                                ) : (
                                  <div className="absolute inset-0" style={{ background: gradient }} />
                                )}
                                <div className="absolute inset-0" style={{ background: theme.tileOverlay }} />
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 px-2">
                                  <span
                                    className="font-bold text-sm tracking-wide uppercase text-center"
                                    style={{ color: theme.tileTextColor, fontFamily: theme.headingFont ?? theme.fontFamily, textShadow: "0 2px 6px rgba(0,0,0,0.5)" }}
                                  >
                                    {cat.name}
                                  </span>
                                  <span className="text-[10px] uppercase tracking-wider" style={{ color: `${theme.tileTextColor}88` }}>
                                    {cat.items.length} ürün
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      );
                      i += pair.length;
                    }
                  }
                  return tiles;
                })()}
              </div>
            </main>
          </div>
        )}

        {/* ── Product detail drawer ── */}
        {activeProduct && (
          <ProductDrawer
            product={activeProduct}
            currency={currency}
            theme={theme}
            onClose={() => setActiveProduct(null)}
          />
        )}

        {/* ── Order widget (floating, only when ordering enabled) ── */}
        {data.orderingEnabled && data.orderToken && data.orderProducts.length > 0 && (
          <OrderWidget
            menuId={menuId}
            orderToken={data.orderToken}
            tables={data.tables}
            orderProducts={data.orderProducts}
            theme={theme}
          />
        )}
      </div>
    </>
  );
}
