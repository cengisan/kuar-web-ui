/**
 * Theme 6 — Natural Sage / Garden
 * Matches menu-6.html: fixed radial gradient bg (beige → cream), white panel header
 * with HORIZONTAL logo+name layout, sage/olive green (#7a8b5f), tag-pill category nav,
 * card grid, dark text #34362c.
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
      className={`relative flex flex-col overflow-hidden rounded-[20px] transition-all duration-300 hover:-translate-y-1 ${!product.is_available ? "opacity-55" : ""}`}
      style={{ background: "#fffdf8", border: "1px solid #e7e0d0", boxShadow: "0 6px 22px rgba(52,54,44,0.07)" }}
    >
      <Labels params={params} />
      {imageUrl ? (
        <div className="relative h-44 shrink-0 overflow-hidden">
          <Image src={imageUrl} alt={product.name} fill className="object-cover transition-transform duration-500 hover:scale-105" unoptimized />
        </div>
      ) : <div className="h-3" />}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1.5 font-bold text-[#34362c] leading-snug">{product.name}</h3>
        {product.description && <p className="mb-2 flex-1 text-sm text-[#8a8577] line-clamp-2">{product.description}</p>}
        {product.allergenNames && product.allergenNames.length > 0 && (
          <div className="mb-1.5 flex flex-wrap gap-1">
            {product.allergenNames.map((a) => <span key={a} className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] text-red-700">{a}</span>)}
          </div>
        )}
        {product.calories != null && product.calories > 0 && (
          <span className="mb-1.5 text-[11px] text-[#8a8577]">🔥 {product.calories} kcal</span>
        )}
        <div className="mt-auto flex items-baseline gap-1.5 pt-1">
          {discountedPrice != null ? (
            <>
              <span className="text-lg font-bold text-[#7a8b5f]">{symbol}{discountedPrice.toFixed(2)}</span>
              <span className="text-sm text-[#8a8577] line-through">{symbol}{product.price!.toFixed(2)}</span>
            </>
          ) : product.price != null ? (
            <span className="text-lg font-bold text-[#7a8b5f]">{symbol}{product.price.toFixed(2)}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

interface Props { menuId: string; data: MenuApiData; }

export default function MenuTheme6({ menuId, data }: Props) {
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
    <div
      style={{
        background: "radial-gradient(circle at 15% 0%, rgba(122,139,95,0.10) 0%, transparent 40%), linear-gradient(160deg, #f3efe6 0%, #e9e2d3 100%)",
        backgroundAttachment: "fixed",
        color: "#34362c",
        minHeight: "100svh",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* Header — white panel, horizontal layout */}
      <header className="mx-auto max-w-5xl p-4 pt-4 pb-0">
        <div
          className="rounded-[20px] p-6"
          style={{ background: "#fffdf8", border: "1px solid #e7e0d0", boxShadow: "0 6px 22px rgba(52,54,44,0.07)" }}
        >
          <div className="flex flex-wrap items-center gap-5">
            {logoUrl && (
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 transition-transform hover:scale-105" style={{ borderColor: "#7a8b5f" }}>
                <Image src={logoUrl} alt={data.name} fill className="object-cover" unoptimized />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold uppercase tracking-wide text-[#34362c]">{data.name}</h1>
              {digitalMenu.business_name && digitalMenu.business_name !== data.name && (
                <p className="mt-0.5 text-sm text-[#8a8577]">{digitalMenu.business_name}</p>
              )}
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  style={{ background: "#7a8b5f" }}>
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sticky Category Nav */}
      {categories.length > 1 && (
        <nav className="sticky top-0 z-30 border-b backdrop-blur-sm" style={{ background: "rgba(243,239,230,0.9)", borderColor: "#e7e0d0" }}>
          <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none" style={{ scrollbarWidth: "none" }}>
            {categories.map((cat) => {
              const key = normalizeCategory(cat);
              return (
                <a key={cat} href={`#cat-${key}`}
                  className="shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium text-[#7a8b5f] transition-all hover:bg-[#7a8b5f] hover:text-white"
                  style={{ borderColor: "rgba(122,139,95,0.35)", whiteSpace: "nowrap" }}>
                  {cat}
                </a>
              );
            })}
          </div>
        </nav>
      )}

      {/* Products */}
      <main className="mx-auto max-w-5xl px-4 pb-28 pt-5">
        {categories.map((cat) => {
          const key = normalizeCategory(cat);
          return (
            <section key={cat} id={`cat-${key}`} className="mb-10 scroll-mt-20">
              <h2 className="mb-4 text-xl font-bold text-[#7a8b5f]">{cat}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {byCategory[cat].map((p) => <ProductCard key={p.id} product={p} currency={currency} />)}
              </div>
            </section>
          );
        })}
      </main>

      {orderingEnabled && orderToken && (
        <style>{`:root { --order-accent: #7a8b5f; --order-surface: #1a1c15; --order-text: #f3efe6; }`}</style>
      )}
      {orderingEnabled && orderToken && (
        <MenuOrderWidget menuId={menuId} orderToken={orderToken} tables={tables} orderProducts={orderProducts} apiBaseUrl={apiBase} />
      )}
    </div>
  );
}
