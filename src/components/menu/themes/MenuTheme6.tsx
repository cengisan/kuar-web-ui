"use client";

/**
 * Tema 6 — Urban Sage (Horizontal Pill Tabs + Card Grid)
 * Yapı (menu-6 inspired): Fixed sage/bej zemin, BEYAZ PANEL HEADER
 * (logo + isim YAN YANA), YATay scrollable PILL NAV (kategori seçimi),
 * seçili kategorinin ürünleri geniş kart grid. Plus Jakarta Sans.
 * Gradient yok. Zeytuni yeşil (#7a8b5f) aksant.
 */

import { useState } from "react";
import Image from "next/image";
import type { MenuApiData, ProductData } from "@/types/menu";
import {
  buildImgUrl,
  groupCategories,
  useCurrency,
  ProductDrawer,
  OrderWidget,
  ProductImagePlaceholder,
  ProductExtraLabels,
  ProductCardMeta,
  ProductPriceDisplay,
  MenuLastUpdatedFooter,
} from "@/components/menu/MenuShared";

const BG = "#f3efe6";
const SURFACE = "#fffdf8";
const ACCENT = "#7a8b5f";
const DARK = "#34362c";
const MUTED = "#8a8577";
const PANEL_BORDER = "#e7e0d0";

interface Props { menuId: string; data: MenuApiData }

export default function MenuTheme6({ menuId, data }: Props) {
  const categories = groupCategories(data.products);
  const [activeCat, setActiveCat] = useState(categories[0]?.name ?? "");
  const [drawer, setDrawer] = useState<ProductData | null>(null);
  const currency = useCurrency(data);
  const logoUrl = buildImgUrl(data.digitalMenu.digital_menu_image?.[0]?.image_url);
  const activeItems = categories.find((c) => c.name === activeCat)?.items ?? [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        html,body{margin:0;padding:0;box-sizing:border-box}
        body{background:${BG};min-height:100vh}
        .t6-pills::-webkit-scrollbar{display:none}
      `}</style>

      <div style={{ minHeight: "100svh", background: BG, fontFamily: "'Plus Jakarta Sans',sans-serif", color: DARK }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "1.25rem 1rem" }}>

          {/* White panel header — logo + name side by side */}
          <div style={{
            background: SURFACE,
            border: `1px solid ${PANEL_BORDER}`,
            borderRadius: 18,
            padding: "1.75rem 1.5rem",
            marginBottom: "1.5rem",
            boxShadow: "0 4px 16px rgba(52,54,44,0.07)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, flexWrap: "wrap" }}>
              {logoUrl && (
                <div style={{ width: 76, height: 76, borderRadius: "50%", overflow: "hidden", border: `2px solid ${ACCENT}`, flexShrink: 0 }}>
                  <Image src={logoUrl} alt={data.name} width={76} height={76} className="object-cover" />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 160 }}>
                <h1 style={{ fontSize: "clamp(1.4rem,4vw,2rem)", fontWeight: 700, margin: "0 0 4px", color: DARK, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  {data.name}
                </h1>
                {data.digitalMenu.business_name && data.digitalMenu.business_name !== data.name && (
                  <p style={{ margin: 0, fontSize: "0.85rem", color: MUTED }}>{data.digitalMenu.business_name}</p>
                )}
              </div>
            </div>
          </div>

          {/* White pill-nav card */}
          <div style={{
            background: SURFACE,
            border: `1px solid ${PANEL_BORDER}`,
            borderRadius: 18,
            padding: "1.25rem",
            marginBottom: "1.25rem",
            boxShadow: "0 4px 16px rgba(52,54,44,0.06)",
          }}>
            <div
              className="t6-pills"
              style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
            >
              {categories.map((cat) => {
                const active = cat.name === activeCat;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCat(cat.name)}
                    style={{
                      flexShrink: 0,
                      padding: "0.5rem 1.1rem",
                      borderRadius: 999,
                      border: active ? "none" : `1px solid ${PANEL_BORDER}`,
                      fontWeight: active ? 600 : 400,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      background: active ? ACCENT : "transparent",
                      color: active ? "#fff" : DARK,
                    }}
                  >
                    {cat.name}
                    <span style={{ marginLeft: 5, opacity: 0.6, fontSize: "0.75rem" }}>({cat.items.length})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product card grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(155px,1fr))", gap: 14, paddingBottom: 0 }}>
            {activeItems.map((p) => {
              const imgUrl = buildImgUrl(p.product_image?.[0]?.image_url);
              return (
                <div
                  key={p.id}
                  onClick={() => setDrawer(p)}
                  style={{
                    background: SURFACE,
                    borderRadius: 16,
                    border: `1px solid ${PANEL_BORDER}`,
                    overflow: "hidden",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 2px 10px rgba(52,54,44,0.07)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                >
                  <div style={{ position: "relative", height: 140, background: "#ece5d5", flexShrink: 0 }}>
                    {imgUrl ? (
                      <Image src={imgUrl} alt={p.name} fill className="object-cover" sizes="(max-width:640px) 50vw, 25vw" />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ProductImagePlaceholder size={30} color="#bbb" />
                      </div>
                    )}
                    <ProductExtraLabels product={p} layout="overlay" />
                  </div>
                  <div style={{ padding: "0.85rem 0.9rem", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem", color: DARK, lineHeight: 1.3 }}>{p.name}</p>
                    {p.description && (
                      <p style={{ margin: 0, fontSize: "0.77rem", color: MUTED, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {p.description}
                      </p>
                    )}
                    <ProductCardMeta product={p} showLabels={false} />
                    <p style={{ margin: "4px 0 0" }}>
                      <ProductPriceDisplay product={p} currency={currency} accentColor={ACCENT} fontSize="0.95rem" />
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <MenuLastUpdatedFooter digitalMenu={data.digitalMenu} color={MUTED} borderColor={PANEL_BORDER} />

        {drawer && (
          <ProductDrawer product={drawer} currency={currency} accentColor={ACCENT} onClose={() => setDrawer(null)} />
        )}

        {data.orderingEnabled && data.orderToken && data.orderProducts.length > 0 && (
          <OrderWidget menuId={menuId} orderToken={data.orderToken} tables={data.tables} orderProducts={data.orderProducts} accentColor={ACCENT} surfaceColor={DARK} />
        )}
      </div>
    </>
  );
}
