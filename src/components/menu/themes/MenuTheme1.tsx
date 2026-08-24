/**
 * Theme 1 — Neumorphic Warm Café
 * Matches menu-1.html: warm beige bg, neumorphic shadows, Plus Jakarta Sans,
 * sticky pill category nav, card grid with image on top.
 */
import Image from "next/image";
import type { MenuApiData, ProductData } from "@/types/menu";
import { getCurrencySymbol, buildInstagramUrl, normalizeCategory } from "@/types/menu";
import { MenuOrderWidget } from "../MenuOrderWidget";

const NEU_SHADOW = "7px 7px 16px #c7bdac, -7px -7px 16px #fbf3e6";
const NEU_SHADOW_INSET = "inset 5px 5px 11px #c7bdac, inset -5px -5px 11px #fbf3e6";

function Labels({ params }: { params: ProductData["extra_parameters"] }) {
  if (!params) return null;
  const hasDiscount = params.discount && params.discount !== "0" && params.discount !== "";
  return (
    <div className="absolute right-2.5 top-2.5 z-10 flex flex-col gap-1">
      {params.is_new_item && (
        <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">YENİ</span>
      )}
      {params.is_campaign && (
        <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-900 shadow">KAMPANYA</span>
      )}
      {params.is_favorite && (
        <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">FAVORİ</span>
      )}
      {hasDiscount && (
        <span className="rounded-full bg-cyan-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">%{params.discount}</span>
      )}
    </div>
  );
}

function ProductCard({ product, currency }: { product: ProductData; currency: string | null }) {
  const symbol = getCurrencySymbol(currency);
  const params = product.extra_parameters;
  const hasDiscount = params?.discount && params.discount !== "0" && params.discount !== "";
  let discountedPrice: number | null = null;
  if (hasDiscount && product.price != null) {
    try {
      const d = parseFloat(params!.discount!.replace(",", "."));
      if (d > 0) discountedPrice = Math.round(product.price * (1 - d / 100) * 100) / 100;
    } catch { /* ignore */ }
  }
  const imageUrl = product.product_image?.[0]?.image_url;

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-[26px] transition-all duration-300 hover:-translate-y-1 ${!product.is_available ? "opacity-60" : ""}`}
      style={{ background: "#ece3d5", boxShadow: NEU_SHADOW }}
    >
      <Labels params={params} />
      {imageUrl ? (
        <div className="relative h-48 shrink-0 overflow-hidden rounded-t-[26px] bg-[#f0e8dc]">
          <Image src={imageUrl} alt={product.name} fill className="object-cover" unoptimized />
        </div>
      ) : (
        <div className="h-4" />
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-1.5 text-lg font-bold text-[#5c3317] leading-snug">{product.name}</h3>
        {product.description && (
          <p className="mb-2 line-clamp-2 flex-1 text-sm leading-relaxed text-[#8a7862]">{product.description}</p>
        )}
        {product.allergenNames && product.allergenNames.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {product.allergenNames.map((a) => (
              <span key={a} className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700">{a}</span>
            ))}
          </div>
        )}
        {product.calories != null && product.calories > 0 && (
          <span className="mb-2 inline-block rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-[11px] font-medium text-orange-700">
            🔥 {product.calories} kcal
          </span>
        )}
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          {discountedPrice != null ? (
            <>
              <span className="text-xl font-bold text-[#c8763c]">{symbol}{discountedPrice.toFixed(2)}</span>
              <span className="text-sm font-medium text-[#8a7862] line-through">{symbol}{product.price!.toFixed(2)}</span>
            </>
          ) : product.price != null ? (
            <span className="text-xl font-bold text-[#c8763c]">{symbol}{product.price.toFixed(2)}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

interface Props { menuId: string; data: MenuApiData; }

export default function MenuTheme1({ menuId, data }: Props) {
  const { digitalMenu, products, orderingEnabled, orderToken, tables, orderProducts } = data;
  const instagramUrl = buildInstagramUrl(data.socialMedia);
  const logoUrl = digitalMenu.digital_menu_image?.[0]?.image_url;
  const currency = digitalMenu.currency;
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://kuar-test.up.railway.app/api/v1";

  const categories: string[] = [];
  const byCategory: Record<string, ProductData[]> = {};
  for (const p of products) {
    const cat = p.category ?? "Diğer";
    if (!byCategory[cat]) { categories.push(cat); byCategory[cat] = []; }
    byCategory[cat].push(p);
  }

  return (
    <div style={{ background: "#e9e0d2", color: "#5c3317", minHeight: "100svh", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <div className="mx-auto max-w-5xl px-4 pb-4 pt-6">
        <div className="rounded-[26px] p-10 text-center" style={{ background: "#ece3d5", boxShadow: NEU_SHADOW }}>
          {logoUrl && (
            <div className="mb-4 flex justify-center">
              <div className="relative h-28 w-28 overflow-hidden rounded-full p-2" style={{ background: "#ece3d5", boxShadow: NEU_SHADOW }}>
                <Image src={logoUrl} alt={data.name} fill className="rounded-full object-cover" unoptimized />
              </div>
            </div>
          )}
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-[#5c3317]">{data.name}</h1>
          {instagramUrl && (
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-[#b5622e] transition-all"
              style={{ background: "#ece3d5", boxShadow: NEU_SHADOW }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
              Instagram
            </a>
          )}
        </div>
      </div>

      {/* Sticky Category Nav */}
      {categories.length > 1 && (
        <div className="sticky top-0 z-30 py-3" style={{ background: "#e9e0d2" }}>
          <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-none" style={{ scrollbarWidth: "none" }}>
            {categories.map((cat) => {
              const key = normalizeCategory(cat);
              return (
                <a key={cat} href={`#cat-${key}`}
                  className="shrink-0 rounded-full px-5 py-2 text-sm font-semibold text-[#5c3317] transition-all"
                  style={{ background: "#ece3d5", boxShadow: "5px 5px 11px #c7bdac, -5px -5px 11px #fbf3e6", whiteSpace: "nowrap" }}>
                  {cat}
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Products */}
      <main className="mx-auto max-w-5xl px-4 pb-28 pt-2">
        {categories.map((cat) => {
          const key = normalizeCategory(cat);
          return (
            <section key={cat} id={`cat-${key}`} className="mb-10 scroll-mt-20">
              <h2 className="mb-4 text-xl font-bold text-[#5c3317]">{cat}</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {byCategory[cat].map((p) => <ProductCard key={p.id} product={p} currency={currency} />)}
              </div>
            </section>
          );
        })}
      </main>

      {orderingEnabled && orderToken && (
        <MenuOrderWidget menuId={menuId} orderToken={orderToken} tables={tables} orderProducts={orderProducts} apiBaseUrl={apiBase} />
      )}
    </div>
  );
}
