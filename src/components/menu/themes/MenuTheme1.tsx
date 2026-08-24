"use client";

/**
 * Tema 1 — Neumorphic Tabs
 * Yapı (menu-1 inspired): Sıcak bej zemin, neumorphic gölgeler,
 * YATAY SCROLLABLE TAB NAV (sticky), seçilen kategorinin ürünleri
 * grid olarak altında gösterilir. Ürüne tıklanınca detay drawer açılır.
 * Renk: #e9e0d2 zemin, #8b4513 koyu, #c8763c aksant — gradient yok.
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
} from "@/components/menu/MenuShared";

const BG = "#e9e0d2";
const SURFACE = "#ece3d5";
const DARK = "#5c3317";
const ACCENT = "#c8763c";
const MUTED = "#8a7862";
const NEU_SHADOW = "7px 7px 16px #c7bdac, -7px -7px 16px #fbf3e6";
const NEU_INSET = "inset 5px 5px 11px #c7bdac, inset -5px -5px 11px #fbf3e6";

interface Props { menuId: string; data: MenuApiData }

export default function MenuTheme1({ menuId, data }: Props) {
  const categories = groupCategories(data.products);
  const [activeCat, setActiveCat] = useState(categories[0]?.name ?? "");
  const [drawer, setDrawer] = useState<ProductData | null>(null);
  const currency = useCurrency(data);
  const logoUrl = buildImgUrl(data.digitalMenu.digital_menu_image?.[0]?.image_url);
  const activeItems = categories.find((c) => c.name === activeCat)?.items ?? [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        html,body{margin:0;padding:0;box-sizing:border-box}
        .t1-tabs::-webkit-scrollbar{display:none}
      `}</style>

      <div style={{ background: BG, fontFamily: "'Plus Jakarta Sans',sans-serif", color: DARK, minHeight: "100svh" }}>

        {/* Header */}
        <div style={{ background: SURFACE, padding: "2.5rem 1.5rem 2rem", textAlign: "center", boxShadow: NEU_SHADOW }}>
          {logoUrl ? (
            <div style={{ display: "inline-block", width: 100, height: 100, borderRadius: "50%", overflow: "hidden", boxShadow: NEU_SHADOW, marginBottom: 14 }}>
              <Image src={logoUrl} alt={data.name} width={100} height={100} className="object-cover" />
            </div>
          ) : (
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 100, height: 100, borderRadius: "50%", background: SURFACE, boxShadow: NEU_SHADOW, marginBottom: 14, color: MUTED }}>
              <ProductImagePlaceholder size={36} color={MUTED} />
            </div>
          )}
          <h1 style={{ fontSize: "clamp(1.5rem,4vw,2.2rem)", fontWeight: 700, margin: 0, color: DARK }}>{data.name}</h1>
          {data.digitalMenu.business_name && data.digitalMenu.business_name !== data.name && (
            <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: MUTED }}>{data.digitalMenu.business_name}</p>
          )}
        </div>

        {/* Sticky tab nav */}
        <div style={{ position: "sticky", top: 0, zIndex: 100, background: BG, padding: "0.9rem 1rem", borderBottom: `1px solid #d4c9b8` }}>
          <div
            className="t1-tabs"
            style={{ display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
          >
            {categories.map((cat) => {
              const active = cat.name === activeCat;
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCat(cat.name)}
                  style={{
                    flexShrink: 0,
                    padding: "0.55rem 1.25rem",
                    borderRadius: 999,
                    border: "none",
                    fontWeight: 600,
                    fontSize: "0.88rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    background: active ? ACCENT : SURFACE,
                    color: active ? "#fff" : DARK,
                    boxShadow: active ? "none" : "5px 5px 10px #c7bdac, -5px -5px 10px #fbf3e6",
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products grid */}
        <div style={{ padding: "1.25rem 1rem 6rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
            {activeItems.map((p) => {
              const imgUrl = buildImgUrl(p.product_image?.[0]?.image_url);
              return (
                <div
                  key={p.id}
                  onClick={() => setDrawer(p)}
                  style={{
                    background: SURFACE,
                    borderRadius: 20,
                    boxShadow: NEU_SHADOW,
                    overflow: "hidden",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s",
                  }}
                >
                  {/* Image */}
                  <div style={{ position: "relative", height: 150, background: "#ddd5c6", flexShrink: 0 }}>
                    {imgUrl ? (
                      <Image src={imgUrl} alt={p.name} fill className="object-cover" sizes="50vw" />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#ddd5c6" }}>
                        <ProductImagePlaceholder size={36} color={MUTED} />
                      </div>
                    )}
                    <ProductExtraLabels product={p} layout="overlay" />
                  </div>
                  {/* Body */}
                  <div style={{ padding: "0.9rem 0.85rem 0.85rem", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9rem", color: DARK, lineHeight: 1.3 }}>{p.name}</p>
                    {p.description && (
                      <p style={{ margin: 0, fontSize: "0.78rem", color: MUTED, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {p.description}
                      </p>
                    )}
                    <ProductCardMeta product={p} showLabels={false} />
                    <p style={{ margin: "4px 0 0", fontWeight: 700, fontSize: "1.05rem", color: ACCENT }}>{(p.price ?? 0).toFixed(2)} {currency}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {drawer && (
          <ProductDrawer product={drawer} currency={currency} accentColor={ACCENT} onClose={() => setDrawer(null)} />
        )}

        {data.orderingEnabled && data.orderToken && data.orderProducts.length > 0 && (
          <OrderWidget
            menuId={menuId}
            orderToken={data.orderToken}
            tables={data.tables}
            orderProducts={data.orderProducts}
            accentColor={ACCENT}
            surfaceColor="#3d2510"
          />
        )}
      </div>
    </>
  );
}
