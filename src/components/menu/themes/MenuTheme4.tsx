/**
 * Theme 4 — Rustic Sage / Nature
 * Matches menu-4.html: cream gradient bg, white rounded container (max-w 900px),
 * wooden header with dark-green overlay, Playfair Display headings,
 * LIST-style products with dashed separators, sage green (#4a5138) + terracotta (#c06a45).
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
    <div className="mb-1 flex flex-wrap gap-1">
      {params.is_new_item && <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">YENİ</span>}
      {params.is_campaign && <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase text-gray-900">KAMPANYA</span>}
      {params.is_favorite && <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">FAVORİ</span>}
      {hasDiscount && <span className="rounded-full bg-cyan-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">%{params.discount}</span>}
    </div>
  );
}

function ProductListItem({ product, currency }: { product: ProductData; currency: string | null }) {
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
      className={`border-b py-5 transition-all hover:px-2 hover:rounded-xl last:border-b-0 ${!product.is_available ? "opacity-55" : ""}`}
      style={{ borderColor: "rgba(111,125,74,0.35)", borderStyle: "dashed" }}
    >
      <div className="flex gap-4 items-start">
        {imageUrl && (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
            <Image src={imageUrl} alt={product.name} fill className="object-cover" unoptimized />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <Labels params={params} />
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-[#2f3324] leading-snug" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{product.name}</h3>
            <div className="shrink-0 text-right ml-2">
              {discountedPrice != null ? (
                <div>
                  <p className="font-bold text-[#6f7d4a]">{symbol}{discountedPrice.toFixed(2)}</p>
                  <p className="text-xs text-[#7c7561] line-through">{symbol}{product.price!.toFixed(2)}</p>
                </div>
              ) : product.price != null ? (
                <p className="font-bold text-[#6f7d4a]">{symbol}{product.price.toFixed(2)}</p>
              ) : null}
            </div>
          </div>
          {product.description && <p className="mt-0.5 text-sm text-[#7c7561] leading-relaxed">{product.description}</p>}
          <div className="mt-1.5 flex flex-wrap gap-2">
            {product.allergenNames && product.allergenNames.length > 0 && (
              <span className="text-[11px] text-[#7c7561]">🌾 {product.allergenNames.join(", ")}</span>
            )}
            {product.calories != null && product.calories > 0 && (
              <span className="text-[11px] text-[#7c7561]">🔥 {product.calories} kcal</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface Props { menuId: string; data: MenuApiData; }

export default function MenuTheme4({ menuId, data }: Props) {
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
      className="p-3 pb-28 sm:p-6"
      style={{
        background: "linear-gradient(180deg, #efe8d6 0%, #f7f3ea 100%)",
        minHeight: "100svh",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&display=swap');`}</style>

      {/* Outer container */}
      <div
        className="mx-auto max-w-3xl overflow-hidden rounded-[18px]"
        style={{ background: "#fffdf8", border: "1px solid rgba(111,125,74,0.14)", boxShadow: "0 6px 22px rgba(47,51,36,0.08)" }}
      >
        {/* Wooden header */}
        <header
          className="relative overflow-hidden px-8 py-14 text-center"
          style={{ backgroundImage: `url('${WOODEN_BG}')`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(47,51,36,0.82) 0%, rgba(74,81,56,0.62) 100%)" }} />
          <div className="relative z-10">
            {logoUrl && (
              <div className="mb-4 flex justify-center">
                <div className="relative h-26 w-26 overflow-hidden rounded-full border-3 shadow-xl" style={{ border: "3px solid rgba(255,255,255,0.92)" }}>
                  <Image src={logoUrl} alt={data.name} width={104} height={104} className="rounded-full object-cover" unoptimized />
                </div>
              </div>
            )}
            <h1 className="mb-3 text-4xl font-semibold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{data.name}</h1>
            {instagramUrl && (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                style={{ background: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.35)" }}>
                Instagram
              </a>
            )}
          </div>
        </header>

        {/* Products */}
        <div className="px-6 pb-8 pt-6">
          {categories.map((cat) => {
            const key = normalizeCategory(cat);
            return (
              <section key={cat} id={`cat-${key}`} className="mb-8 scroll-mt-4">
                <h2
                  className="mb-3 flex items-center gap-2 border-b pb-2 text-2xl font-semibold text-[#4a5138]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", borderColor: "rgba(111,125,74,0.4)" }}
                >
                  <span className="text-[#c06a45]">🍃</span>
                  {cat}
                </h2>
                {byCategory[cat].map((p) => <ProductListItem key={p.id} product={p} currency={currency} />)}
              </section>
            );
          })}
        </div>
      </div>

      {orderingEnabled && orderToken && (
        <MenuOrderWidget menuId={menuId} orderToken={orderToken} tables={tables} orderProducts={orderProducts} apiBaseUrl={apiBase} />
      )}
    </div>
  );
}
