import Image from "next/image";
import type { MenuApiData, ProductData } from "@/types/menu";
import {
  getCurrencySymbol,
  buildInstagramUrl,
  normalizeCategory,
  CATEGORY_IMAGE_MAP,
} from "@/types/menu";
import { MenuOrderWidget } from "./MenuOrderWidget";

type CSSWithVars = React.CSSProperties & { [key: `--${string}`]: string };

export interface ThemeConfig {
  /** CSS custom properties + standard CSSProperties to inject on the root element */
  vars: CSSWithVars;
  /** Class applied to the outermost wrapper */
  wrapperClass: string;
  /** Class applied to the header section */
  headerClass: string;
  /** Class applied to the sticky category nav bar */
  navClass: string;
  /** Class applied to individual category nav buttons */
  navButtonClass: string;
  /** Class applied to the active category nav button */
  navButtonActiveClass: string;
  /** Class applied to a product card */
  cardClass: string;
  /** Class applied to the section heading (category title) */
  sectionHeadingClass: string;
}

interface MenuLayoutProps {
  menuId: string;
  data: MenuApiData;
  theme: ThemeConfig;
}

function ProductLabel({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
      style={{ background: color }}
    >
      {label}
    </span>
  );
}

function ProductCard({
  product,
  currency,
  cardClass,
}: {
  product: ProductData;
  currency: string | null;
  cardClass: string;
}) {
  const symbol = getCurrencySymbol(currency);
  const params = product.extra_parameters;
  const hasDiscount = params?.discount && params.discount !== "0" && params.discount !== "";
  const imageUrl = product.product_image?.[0]?.image_url;

  let discountedPrice: number | null = null;
  if (hasDiscount && product.price != null) {
    try {
      const d = parseFloat(params!.discount!.replace(",", "."));
      if (d > 0) discountedPrice = Math.round(product.price * (1 - d / 100) * 100) / 100;
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      className={`${cardClass} ${!product.is_available ? "opacity-55" : ""} flex flex-col overflow-hidden`}
    >
      {imageUrl && (
        <div className="relative h-40 w-full shrink-0 overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
            unoptimized
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {/* Labels */}
        {params && (
          <div className="flex flex-wrap gap-1">
            {params.is_new_item && <ProductLabel label="Yeni" color="#3b82f6" />}
            {params.is_campaign && <ProductLabel label="Kampanya" color="#f59e0b" />}
            {params.is_favorite && <ProductLabel label="Favori" color="#ec4899" />}
            {hasDiscount && (
              <ProductLabel label={`%${params.discount} indirim`} color="#10b981" />
            )}
            {!product.is_available && (
              <ProductLabel label="Mevcut Değil" color="#6b7280" />
            )}
          </div>
        )}

        <h3 className="font-semibold leading-snug" style={{ color: "var(--menu-text)" }}>
          {product.name}
        </h3>

        {product.description && (
          <p className="line-clamp-2 text-sm" style={{ color: "var(--menu-text-muted)" }}>
            {product.description}
          </p>
        )}

        {/* Allergens */}
        {product.allergenNames && product.allergenNames.length > 0 && (
          <p className="text-xs" style={{ color: "var(--menu-text-muted)" }}>
            🌾 {product.allergenNames.join(", ")}
          </p>
        )}

        {/* Calories */}
        {product.calories != null && product.calories > 0 && (
          <p className="text-xs" style={{ color: "var(--menu-text-muted)" }}>
            🔥 {product.calories} kcal
          </p>
        )}

        {/* Price */}
        {product.price != null && (
          <div className="mt-auto flex items-baseline gap-1.5 pt-1">
            {discountedPrice != null ? (
              <>
                <span
                  className="font-bold text-lg"
                  style={{ color: "var(--menu-accent)" }}
                >
                  {symbol}{discountedPrice.toFixed(2)}
                </span>
                <span
                  className="text-sm line-through"
                  style={{ color: "var(--menu-text-muted)" }}
                >
                  {symbol}{product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span
                className="font-bold text-lg"
                style={{ color: "var(--menu-accent)" }}
              >
                {symbol}{product.price.toFixed(2)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function MenuLayout({ menuId, data, theme }: MenuLayoutProps) {
  const { digitalMenu, products, orderingEnabled, orderToken, tables, orderProducts } = data;

  // Group products by category (preserving order)
  const categories: string[] = [];
  const productsByCategory: Record<string, ProductData[]> = {};
  for (const p of products) {
    const cat = p.category ?? "Diğer";
    if (!productsByCategory[cat]) {
      categories.push(cat);
      productsByCategory[cat] = [];
    }
    productsByCategory[cat].push(p);
  }

  const instagramUrl = buildInstagramUrl(data.socialMedia);
  const logoUrl = digitalMenu.digital_menu_image?.[0]?.image_url;
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://kuar-test.up.railway.app/api/v1";

  return (
    <div style={theme.vars} className={theme.wrapperClass}>
      {/* Header */}
      <header className={theme.headerClass}>
        {logoUrl && (
          <div className="mb-4 flex justify-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 shadow-lg"
              style={{ borderColor: "var(--menu-accent)" }}>
              <Image
                src={logoUrl}
                alt={data.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        )}
        <h1 className="text-3xl font-bold tracking-tight">{data.name}</h1>
        {digitalMenu.business_name && digitalMenu.business_name !== data.name && (
          <p className="mt-1 text-sm" style={{ color: "var(--menu-text-muted)" }}>
            {digitalMenu.business_name}
          </p>
        )}
        {instagramUrl && (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-opacity hover:opacity-80"
            style={{
              background: "var(--menu-accent)",
              color: "#fff",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0" fill="currentColor" strokeWidth="3" />
            </svg>
            Instagram
          </a>
        )}
      </header>

      {/* Category navigation */}
      {categories.length > 1 && (
        <nav className={theme.navClass} aria-label="Kategoriler">
          <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-none">
            {categories.map((cat) => {
              const key = normalizeCategory(cat);
              const iconUrl = CATEGORY_IMAGE_MAP[key];
              return (
                <a
                  key={cat}
                  href={`#cat-${key}`}
                  className={`${theme.navButtonClass} flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all`}
                >
                  {iconUrl && (
                    <Image
                      src={iconUrl}
                      alt=""
                      width={18}
                      height={18}
                      className="opacity-80"
                      unoptimized
                    />
                  )}
                  {cat}
                </a>
              );
            })}
          </div>
        </nav>
      )}

      {/* Product sections */}
      <main className="mx-auto w-full max-w-3xl px-4 pb-32 pt-4">
        {categories.map((cat) => {
          const key = normalizeCategory(cat);
          return (
            <section key={cat} id={`cat-${key}`} className="mb-10 scroll-mt-20">
              <h2 className={`${theme.sectionHeadingClass} mb-4`}>{cat}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {productsByCategory[cat].map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currency={digitalMenu.currency}
                    cardClass={theme.cardClass}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {products.length === 0 && (
          <div className="py-20 text-center" style={{ color: "var(--menu-text-muted)" }}>
            <p className="text-lg">Henüz ürün eklenmemiş.</p>
          </div>
        )}
      </main>

      {/* Order widget */}
      {orderingEnabled && orderToken && (
        <MenuOrderWidget
          menuId={menuId}
          orderToken={orderToken}
          tables={tables}
          orderProducts={orderProducts}
          apiBaseUrl={apiBase}
        />
      )}
    </div>
  );
}
