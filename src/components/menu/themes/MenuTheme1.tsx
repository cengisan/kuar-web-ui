"use client";

/**
 * Tema 1 — Hero + Category Banners
 * Koyu header (logo + isim + Instagram), açık zemin üzerinde
 * tam genişlik kategori banner kartları → kategori seçilince ürün grid.
 */

import { useState } from "react";
import Image from "next/image";
import type { MenuApiData, ProductData } from "@/types/menu";
import { buildInstagramUrl } from "@/types/menu";
import {
  buildImgUrl,
  groupCategories,
  useCurrency,
  firstProductImage,
  ProductDrawer,
  OrderWidget,
  ProductImagePlaceholder,
  ProductExtraLabels,
  ProductCardMeta,
  MenuHeaderBanner,
  MenuLastUpdatedFooter,
} from "@/components/menu/MenuShared";
import { getMenuHeaderImage } from "@/config/menuHeaders";

const BG = "#eef1f5";
const SURFACE = "#ffffff";
const DARK = "#14110f";
const ACCENT = "#c8763c";
const MUTED = "#64748b";
const GOLD = "#d4b896";

interface Props { menuId: string; data: MenuApiData }

export default function MenuTheme1({ menuId, data }: Props) {
  const categories = groupCategories(data.products);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<ProductData | null>(null);
  const currency = useCurrency(data);
  const logoUrl = buildImgUrl(data.digitalMenu.digital_menu_image?.[0]?.image_url);
  const instagramUrl = buildInstagramUrl(data.socialMedia ?? data.digitalMenu.social_media);
  const activeItems = activeCat ? (categories.find((c) => c.name === activeCat)?.items ?? []) : [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        html,body{margin:0;padding:0;box-sizing:border-box;background:${BG}}
        .t1-cat-btn{transition:transform 0.22s ease,box-shadow 0.22s ease}
        .t1-cat-btn:active{transform:scale(0.985)}
        .t1-product{transition:transform 0.2s ease,box-shadow 0.2s ease}
        .t1-product:active{transform:scale(0.98)}
      `}</style>

      <div style={{ background: BG, color: DARK, minHeight: "100svh", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>

        {/* Hero header */}
        <MenuHeaderBanner
          background={getMenuHeaderImage("menu1")}
          overlay="rgba(14,11,9,0.74)"
          minHeight={280}
          padding="3.25rem 1.5rem 2.5rem"
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            {logoUrl ? (
              <div
                style={{
                  width: 112,
                  height: 112,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid rgba(255,255,255,0.92)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.35), 0 0 0 6px rgba(14,11,9,0.45)",
                }}
              >
                <Image src={logoUrl} alt={data.name} width={112} height={112} className="object-cover" />
              </div>
            ) : (
              <div
                style={{
                  width: 112,
                  height: 112,
                  borderRadius: "50%",
                  border: "3px solid rgba(255,255,255,0.75)",
                  background: "rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                }}
              >
                <ProductImagePlaceholder size={40} color="rgba(255,255,255,0.6)" />
              </div>
            )}
            <h1
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: "clamp(2rem,5vw,2.75rem)",
                fontWeight: 600,
                margin: 0,
                color: "#fff",
                letterSpacing: "0.04em",
                textTransform: "lowercase",
              }}
            >
              {data.name}
            </h1>
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 4,
                  padding: "0.55rem 1.15rem",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.95)",
                  color: DARK,
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="#E1306C" strokeWidth="2" />
                  <circle cx="12" cy="12" r="4.5" stroke="#E1306C" strokeWidth="2" />
                  <circle cx="17.5" cy="6.5" r="1.2" fill="#E1306C" />
                </svg>
                Instagram
              </a>
            )}
          </div>
        </MenuHeaderBanner>

        {/* Sticky back bar */}
        {activeCat && (
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 120,
              background: "rgba(255,255,255,0.94)",
              backdropFilter: "blur(10px)",
              borderBottom: "1px solid rgba(20,17,15,0.08)",
              padding: "0.75rem 1rem",
            }}
          >
            <button
              type="button"
              onClick={() => setActiveCat(null)}
              style={{
                background: SURFACE,
                border: "1px solid rgba(20,17,15,0.12)",
                borderRadius: 999,
                padding: "0.5rem 1.15rem",
                fontSize: "0.88rem",
                fontWeight: 600,
                color: DARK,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(20,17,15,0.06)",
              }}
            >
              ← Menüye Dön
            </button>
          </div>
        )}

        {/* Category banners OR product grid */}
        {!activeCat ? (
          <div style={{ padding: "1.25rem 1rem 0", display: "flex", flexDirection: "column", gap: 14 }}>
            {categories.map((cat) => {
              const img = firstProductImage(cat.items);
              return (
                <button
                  key={cat.name}
                  type="button"
                  className="t1-cat-btn"
                  onClick={() => setActiveCat(cat.name)}
                  style={{
                    position: "relative",
                    width: "100%",
                    height: 200,
                    border: "none",
                    borderRadius: 16,
                    overflow: "hidden",
                    cursor: "pointer",
                    padding: 0,
                    background: DARK,
                    boxShadow: "0 8px 28px rgba(20,17,15,0.14)",
                    textAlign: "left",
                  }}
                >
                  {img ? (
                    <Image src={img} alt={cat.name} fill sizes="100vw" className="object-cover" />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "linear-gradient(145deg,#2a2520,#14110f)",
                      }}
                    >
                      {logoUrl ? (
                        <Image src={logoUrl} alt="" width={72} height={72} className="object-cover rounded-full opacity-80" />
                      ) : (
                        <ProductImagePlaceholder size={36} color={GOLD} />
                      )}
                    </div>
                  )}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: img ? "linear-gradient(to top, rgba(9,12,18,0.88) 0%, rgba(9,12,18,0.15) 55%, transparent 100%)" : "rgba(0,0,0,0.35)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      padding: "1.35rem 1rem 1rem",
                      textAlign: "center",
                      borderBottom: `3px solid ${GOLD}`,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        fontSize: "clamp(1.35rem,4vw,1.65rem)",
                        fontWeight: 600,
                        color: "#fff",
                        letterSpacing: "0.03em",
                      }}
                    >
                      {cat.name}
                    </span>
                    <span style={{ display: "block", marginTop: 4, fontSize: "0.78rem", color: "rgba(255,255,255,0.65)" }}>
                      {cat.items.length} ürün
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div style={{ padding: "1.25rem 1rem 0" }}>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: "1.75rem",
                fontWeight: 600,
                margin: "0 0 1rem",
                color: DARK,
                letterSpacing: "0.02em",
              }}
            >
              {activeCat}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
              {activeItems.map((p) => {
                const imgUrl = buildImgUrl(p.product_image?.[0]?.image_url);
                return (
                  <div
                    key={p.id}
                    className="t1-product"
                    onClick={() => setDrawer(p)}
                    style={{
                      background: SURFACE,
                      borderRadius: 16,
                      overflow: "hidden",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "0 4px 18px rgba(20,17,15,0.08)",
                      border: "1px solid rgba(20,17,15,0.06)",
                    }}
                  >
                    <div style={{ position: "relative", height: 148, background: "#e8e4de", flexShrink: 0 }}>
                      {imgUrl ? (
                        <Image src={imgUrl} alt={p.name} fill className="object-cover" sizes="50vw" />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <ProductImagePlaceholder size={32} color={MUTED} />
                        </div>
                      )}
                      <ProductExtraLabels product={p} layout="overlay" />
                    </div>
                    <div style={{ padding: "0.85rem 0.8rem 0.9rem", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: "0.92rem", color: DARK, lineHeight: 1.3 }}>{p.name}</p>
                      {p.description && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.76rem",
                            color: MUTED,
                            lineHeight: 1.4,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {p.description}
                        </p>
                      )}
                      <ProductCardMeta product={p} showLabels={false} />
                      <p style={{ margin: "4px 0 0", fontWeight: 700, fontSize: "1rem", color: ACCENT }}>
                        {(p.price ?? 0).toFixed(2)} {currency}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <MenuLastUpdatedFooter digitalMenu={data.digitalMenu} color={MUTED} borderColor="rgba(20,17,15,0.08)" />

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
            surfaceColor={DARK}
          />
        )}
      </div>
    </>
  );
}
