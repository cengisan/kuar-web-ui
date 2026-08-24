/**
 * Theme 3 — Clean Sidebar / Elegant White
 * Matches menu-3.html: white bg, hamburger sidebar nav, Playfair Display headings,
 * horizontal product items (image left, content right), sage green accent (#8c9a86).
 */
import Image from "next/image";
import type { MenuApiData, ProductData } from "@/types/menu";
import { getCurrencySymbol, buildInstagramUrl, normalizeCategory } from "@/types/menu";
import { MenuOrderWidget } from "../MenuOrderWidget";
import { SidebarNav } from "../SidebarNav";

function Labels({ params }: { params: ProductData["extra_parameters"] }) {
  if (!params) return null;
  const hasDiscount = params.discount && params.discount !== "0" && params.discount !== "";
  return (
    <div className="flex flex-wrap gap-1 mb-1.5">
      {params.is_new_item && <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">YENİ</span>}
      {params.is_campaign && <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase text-gray-900">KAMPANYA</span>}
      {params.is_favorite && <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">FAVORİ</span>}
      {hasDiscount && <span className="rounded-full bg-cyan-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">%{params.discount}</span>}
      {!params.is_new_item && !params.is_campaign && !params.is_favorite && !hasDiscount ? null : null}
    </div>
  );
}

function ProductHorizontalItem({ product, currency }: { product: ProductData; currency: string | null }) {
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
      className={`mb-3 flex overflow-hidden rounded-[14px] border transition-all hover:-translate-y-0.5 ${!product.is_available ? "opacity-55" : ""}`}
      style={{ background: "#ffffff", borderColor: "#ebe6dd", boxShadow: "0 1px 3px rgba(32,30,27,0.05)" }}
    >
      {imageUrl && (
        <div className="relative w-32 shrink-0 bg-[#f0ebe4]">
          <Image src={imageUrl} alt={product.name} fill className="object-cover" unoptimized />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-between p-4 min-w-0">
        <div>
          <Labels params={params} />
          <h3 className="mb-1 font-semibold text-[#201e1b] leading-snug">{product.name}</h3>
          {product.description && <p className="mb-2 text-sm text-[#8b867e] leading-relaxed line-clamp-2">{product.description}</p>}
          {product.allergenNames && product.allergenNames.length > 0 && (
            <div className="mb-1 flex flex-wrap gap-1">
              {product.allergenNames.map((a) => <span key={a} className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] text-red-700">{a}</span>)}
            </div>
          )}
          {product.calories != null && product.calories > 0 && (
            <span className="text-[11px] text-[#8b867e]">🔥 {product.calories} kcal</span>
          )}
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          {discountedPrice != null ? (
            <>
              <span className="font-bold text-[#6f7e69]">{symbol}{discountedPrice.toFixed(2)}</span>
              <span className="text-sm text-[#8b867e] line-through">{symbol}{product.price!.toFixed(2)}</span>
            </>
          ) : product.price != null ? (
            <span className="font-bold text-[#6f7e69]">{symbol}{product.price.toFixed(2)}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

interface Props { menuId: string; data: MenuApiData; }

export default function MenuTheme3({ menuId, data }: Props) {
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
    <div style={{ background: "#ffffff", color: "#201e1b", minHeight: "100svh", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&display=swap');`}</style>

      {/* Hamburger sidebar nav */}
      <SidebarNav categories={categories} accentColor="#8c9a86" />

      {/* Fixed top bar with logo + name (desktop) */}
      <header className="border-b px-6 py-6 text-center mt-0 pt-16" style={{ borderColor: "#ebe6dd" }}>
        {logoUrl && (
          <div className="mb-3 flex justify-center">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border" style={{ borderColor: "#ebe6dd" }}>
              <Image src={logoUrl} alt={data.name} fill className="object-cover" unoptimized />
            </div>
          </div>
        )}
        <h1 className="text-2xl font-semibold text-[#201e1b]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          {data.name}
        </h1>
        {instagramUrl && (
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm transition-colors hover:bg-[#f4f1ea]"
            style={{ borderColor: "#ebe6dd", color: "#201e1b" }}>
            Instagram
          </a>
        )}
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-2xl px-6 pb-28 pt-6">
        {categories.map((cat) => {
          const key = normalizeCategory(cat);
          return (
            <section key={cat} id={`cat-${key}`} className="mb-10 scroll-mt-4">
              <h2
                className="mb-5 border-b pb-2.5 text-2xl font-semibold text-[#201e1b]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", borderColor: "#ebe6dd" }}
              >
                {cat}
              </h2>
              {byCategory[cat].map((p) => <ProductHorizontalItem key={p.id} product={p} currency={currency} />)}
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
