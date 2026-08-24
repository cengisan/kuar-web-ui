/**
 * Theme 5 — Vibrant Modern
 * Matches menu-5.html: warm light bg (#fff4ef), vibrant red-pink gradient header
 * with rounded bottom corners, category sections with banner-style headers,
 * card grid below each banner. Colors: #ff5436, #ff2d6f, #ff6b35.
 */
import Image from "next/image";
import type { MenuApiData, ProductData } from "@/types/menu";
import { getCurrencySymbol, buildInstagramUrl, normalizeCategory } from "@/types/menu";
import { MenuOrderWidget } from "../MenuOrderWidget";

function Labels({ params }: { params: ProductData["extra_parameters"] }) {
  if (!params) return null;
  const hasDiscount = params.discount && params.discount !== "0" && params.discount !== "";
  return (
    <div className="absolute right-2.5 top-2.5 z-10 flex flex-col gap-1">
      {params.is_new_item && <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white shadow">YENİ</span>}
      {params.is_campaign && <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold uppercase text-gray-900 shadow">KAMPANYA</span>}
      {params.is_favorite && <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white shadow">FAVORİ</span>}
      {hasDiscount && <span className="rounded-full bg-cyan-500 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white shadow">%{params.discount}</span>}
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
      className={`relative flex flex-col overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${!product.is_available ? "opacity-55" : ""}`}
      style={{ background: "#ffffff", borderColor: "rgba(178,60,17,0.07)", boxShadow: "0 8px 24px rgba(255,84,54,0.16)" }}
    >
      <Labels params={params} />
      {imageUrl ? (
        <div className="relative h-44 shrink-0 overflow-hidden">
          <Image src={imageUrl} alt={product.name} fill className="object-cover" unoptimized />
        </div>
      ) : (
        <div className="h-3" />
      )}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1.5 font-bold text-[#2b1712] leading-snug">{product.name}</h3>
        {product.description && <p className="mb-2 flex-1 text-sm text-[#8a6f66] line-clamp-2">{product.description}</p>}
        {product.allergenNames && product.allergenNames.length > 0 && (
          <div className="mb-1.5 flex flex-wrap gap-1">
            {product.allergenNames.map((a) => <span key={a} className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] text-red-700">{a}</span>)}
          </div>
        )}
        {product.calories != null && product.calories > 0 && (
          <span className="mb-1.5 text-[11px] text-[#8a6f66]">🔥 {product.calories} kcal</span>
        )}
        <div className="mt-auto flex items-baseline gap-1.5 pt-1">
          {discountedPrice != null ? (
            <>
              <span className="text-lg font-bold text-[#ff5436]">{symbol}{discountedPrice.toFixed(2)}</span>
              <span className="text-sm text-[#8a6f66] line-through">{symbol}{product.price!.toFixed(2)}</span>
            </>
          ) : product.price != null ? (
            <span className="text-lg font-bold text-[#ff5436]">{symbol}{product.price.toFixed(2)}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

interface Props { menuId: string; data: MenuApiData; }

export default function MenuTheme5({ menuId, data }: Props) {
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
    <div style={{ background: "#fff4ef", color: "#2b1712", minHeight: "100svh", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Hero gradient header */}
      <header
        className="relative overflow-hidden px-6 pb-9 pt-10 text-center text-white"
        style={{
          background: "radial-gradient(circle at 15% 15%, rgba(255,179,71,0.55) 0%, transparent 45%), radial-gradient(circle at 88% 10%, rgba(255,45,111,0.5) 0%, transparent 50%), linear-gradient(150deg, #ff5436 0%, #ff2d6f 100%)",
          borderRadius: "0 0 28px 28px",
          boxShadow: "0 8px 24px rgba(255,84,54,0.16)",
        }}
      >
        {logoUrl && (
          <div className="mb-3 flex justify-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-full shadow-xl" style={{ border: "3px solid rgba(255,255,255,0.9)" }}>
              <Image src={logoUrl} alt={data.name} fill className="object-cover" unoptimized />
            </div>
          </div>
        )}
        <h1 className="text-3xl font-bold tracking-tight" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>{data.name}</h1>
        {instagramUrl && (
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold backdrop-blur-sm transition-all hover:bg-white/30"
            style={{ background: "rgba(255,255,255,0.18)", borderColor: "rgba(255,255,255,0.35)" }}>
            Instagram
          </a>
        )}
      </header>

      {/* Products with banner-style category headers */}
      <main className="mx-auto max-w-2xl px-4 pb-28 pt-6">
        {categories.map((cat) => {
          const key = normalizeCategory(cat);
          return (
            <section key={cat} id={`cat-${key}`} className="mb-8 scroll-mt-4">
              {/* Category banner header */}
              <div className="mb-4 flex items-center gap-2">
                <div
                  className="h-5 w-1 rounded-full"
                  style={{ background: "linear-gradient(#ff6b35, #ff5436)" }}
                />
                <h2 className="text-xl font-bold text-[#2b1712]">{cat}</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {byCategory[cat].map((p) => <ProductCard key={p.id} product={p} currency={currency} />)}
              </div>
            </section>
          );
        })}
      </main>

      {orderingEnabled && orderToken && (
        <style>{`:root { --order-accent: #ff5436; --order-surface: #1a0a06; --order-text: #fff4ef; }`}</style>
      )}
      {orderingEnabled && orderToken && (
        <MenuOrderWidget menuId={menuId} orderToken={orderToken} tables={tables} orderProducts={orderProducts} apiBaseUrl={apiBase} />
      )}
    </div>
  );
}
