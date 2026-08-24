/**
 * Theme 2 — Dark Elegant
 * Matches menu-2.html: near-black bg, wooden header with dark overlay,
 * Cormorant Garamond serif, gold accents, dark product cards with gold borders.
 */
import Image from "next/image";
import type { MenuApiData, ProductData } from "@/types/menu";
import { getCurrencySymbol, buildInstagramUrl, normalizeCategory } from "@/types/menu";
import { MenuOrderWidget } from "../MenuOrderWidget";

const WOODEN_BG = "https://halisaha-app-bucket.s3.eu-north-1.amazonaws.com/headerImage/wooden-surface-header.jpg";

function Labels({ params }: { params: ProductData["extra_parameters"] }) {
  if (!params) return null;
  const hasDiscount = params.discount && params.discount !== "0" && params.discount !== "";
  return (
    <div className="absolute right-2.5 top-2.5 z-10 flex flex-col gap-1">
      {params.is_new_item && <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white shadow">YENİ</span>}
      {params.is_campaign && <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold uppercase text-gray-900 shadow">KAMPANYA</span>}
      {params.is_favorite && <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white shadow">FAVORİ</span>}
      {hasDiscount && <span className="rounded-full bg-cyan-600 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white shadow">%{params.discount}</span>}
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
      className={`relative flex flex-col overflow-hidden rounded-[14px] border transition-all duration-300 hover:-translate-y-1 ${!product.is_available ? "opacity-50" : ""}`}
      style={{ background: "#17120e", borderColor: "rgba(201,168,106,0.18)", boxShadow: "0 6px 22px rgba(0,0,0,0.55)" }}
    >
      <Labels params={params} />
      {imageUrl && (
        <div className="relative h-48 shrink-0 overflow-hidden" style={{ background: "#0e0b07" }}>
          <Image src={imageUrl} alt={product.name} fill className="object-cover" unoptimized />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-1.5 text-xl font-semibold leading-snug tracking-wide text-[#f3ece0]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{product.name}</h3>
        {product.description && <p className="mb-2 flex-1 text-sm leading-relaxed text-[#b6aa96]">{product.description}</p>}
        {product.allergenNames && product.allergenNames.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {product.allergenNames.map((a) => <span key={a} className="rounded-full border border-red-900/40 bg-red-950/40 px-2 py-0.5 text-[11px] text-red-300">{a}</span>)}
          </div>
        )}
        {product.calories != null && product.calories > 0 && (
          <span className="mb-2 inline-block rounded-full border border-orange-900/40 bg-orange-950/30 px-2.5 py-0.5 text-[11px] text-orange-300">🔥 {product.calories} kcal</span>
        )}
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          {discountedPrice != null ? (
            <>
              <span className="text-xl font-bold text-[#c9a86a]">{symbol}{discountedPrice.toFixed(2)}</span>
              <span className="text-sm text-[#7a6d58] line-through">{symbol}{product.price!.toFixed(2)}</span>
            </>
          ) : product.price != null ? (
            <span className="text-xl font-bold text-[#c9a86a]">{symbol}{product.price.toFixed(2)}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

interface Props { menuId: string; data: MenuApiData; }

export default function MenuTheme2({ menuId, data }: Props) {
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
    <div style={{ background: "#0b0a09", color: "#f3ece0", minHeight: "100svh", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Font import */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap');`}</style>

      {/* Header */}
      <header
        className="relative overflow-hidden px-6 py-16 text-center"
        style={{ backgroundImage: `url('${WOODEN_BG}')`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(180deg, rgba(11,10,9,0.72) 0%, rgba(11,10,9,0.94) 100%)" }} />
        <div className="relative z-10">
          {logoUrl && (
            <div className="mb-4 flex justify-center">
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 shadow-2xl" style={{ borderColor: "#c9a86a", boxShadow: "0 0 30px rgba(201,168,106,0.35)" }}>
                <Image src={logoUrl} alt={data.name} fill className="object-cover" unoptimized />
              </div>
            </div>
          )}
          <h1 className="mb-2 text-5xl font-semibold tracking-widest text-[#f3ece0]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {data.name}
          </h1>
          <div className="mx-auto mb-4 h-px w-16" style={{ background: "linear-gradient(90deg, transparent, #c9a86a, transparent)" }} />
          {instagramUrl && (
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium uppercase tracking-widest text-[#c9a86a] transition-all hover:bg-[#c9a86a] hover:text-[#1a1512]"
              style={{ borderColor: "rgba(201,168,106,0.5)" }}>
              Instagram
            </a>
          )}
        </div>
      </header>

      {/* Sticky Category Nav */}
      {categories.length > 1 && (
        <nav className="sticky top-0 z-30 border-b backdrop-blur-md" style={{ background: "rgba(11,10,9,0.92)", borderColor: "rgba(201,168,106,0.25)" }}>
          <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none" style={{ scrollbarWidth: "none" }}>
            {categories.map((cat) => {
              const key = normalizeCategory(cat);
              return (
                <a key={cat} href={`#cat-${key}`}
                  className="shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium tracking-wide text-[#c9a86a] transition-all hover:bg-[#c9a86a] hover:text-[#1a1512]"
                  style={{ borderColor: "rgba(201,168,106,0.4)", whiteSpace: "nowrap" }}>
                  {cat}
                </a>
              );
            })}
          </div>
        </nav>
      )}

      {/* Products */}
      <main className="mx-auto max-w-5xl px-4 pb-28 pt-6">
        {categories.map((cat) => {
          const key = normalizeCategory(cat);
          return (
            <section key={cat} id={`cat-${key}`} className="mb-12 scroll-mt-20">
              <h2 className="mb-6 text-3xl font-semibold italic tracking-wide text-[#c9a86a]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                {cat}
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {byCategory[cat].map((p) => <ProductCard key={p.id} product={p} currency={currency} />)}
              </div>
            </section>
          );
        })}
      </main>

      {orderingEnabled && orderToken && (
        <style>{`:root { --order-accent: #c9a86a; --order-surface: #0d0b07; --order-text: #f3ece0; }`}</style>
      )}
      {orderingEnabled && orderToken && (
        <MenuOrderWidget menuId={menuId} orderToken={orderToken} tables={tables} orderProducts={orderProducts} apiBaseUrl={apiBase} />
      )}
    </div>
  );
}
