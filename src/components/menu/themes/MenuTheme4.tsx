"use client";

/**
 * Tema 4 — Classic Scroll-All
 * Yapı (menu-4 inspired): Krem zemin, ahşap header image (yeşil overlay),
 * NAVİGASYON YOK — tüm kategoriler başlık + kesik çizgi ayraç + ürün satırları
 * şeklinde tek sayfada SCROLL ederek görünür. Her ürün:
 * daire thumbnail + isim + açıklama + fiyat. Playfair Display başlıklar.
 * Ürüne tıklanınca detay drawer açılır.
 */

import Image from "next/image";
import { useState } from "react";
import type { MenuApiData, ProductData } from "@/types/menu";
import {
  buildImgUrl,
  groupCategories,
  useCurrency,
  ProductDrawer,
  OrderWidget,
  ProductImagePlaceholder,
  ProductCardMeta,
  MenuHeaderBanner,
  MenuLastUpdatedFooter,
} from "@/components/menu/MenuShared";
import { getMenuHeaderImage } from "@/config/menuHeaders";

const BG = "#f7f3ea";
const SURFACE = "#fffdf8";
const MAIN = "#4a5138";
const DARK = "#2f3324";
const ACCENT_T = "#c06a45";
const ACCENT_G = "#6f7d4a";
const MUTED = "#7c7561";
const LINE = "rgba(111,125,74,0.30)";

interface Props { menuId: string; data: MenuApiData }

export default function MenuTheme4({ menuId, data }: Props) {
  const categories = groupCategories(data.products);
  const [drawer, setDrawer] = useState<ProductData | null>(null);
  const currency = useCurrency(data);
  const logoUrl = buildImgUrl(data.digitalMenu.digital_menu_image?.[0]?.image_url);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');
        html,body{margin:0;padding:0;box-sizing:border-box;width:100%}
        body{background:${SURFACE};min-height:100vh}
        .t4-shell{width:100%;max-width:100%;margin:0;background:${SURFACE};overflow:hidden}
        .t4-content{padding:1rem 1.125rem 0}
        @media (min-width:769px){
          body{background:${BG}}
          .t4-shell{max-width:900px;margin:0.75rem auto;border-radius:18px;box-shadow:0 6px 22px rgba(47,51,36,0.08);border:1px solid rgba(111,125,74,0.14)}
          .t4-content{padding:1.25rem 1.5rem 0}
        }
      `}</style>

      <div className="t4-shell" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", color: DARK }}>

          <MenuHeaderBanner
            background={getMenuHeaderImage("menu4")}
            overlay="rgba(47,51,36,0.86)"
            minHeight={180}
            padding="2rem 1rem"
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              {logoUrl ? (
                <div style={{ width: 100, height: 100, borderRadius: "50%", overflow: "hidden", border: "3px solid rgba(255,255,255,0.95)", boxShadow: "0 0 0 5px rgba(47,51,36,0.5), 0 8px 24px rgba(0,0,0,0.25)" }}>
                  <Image src={logoUrl} alt={data.name} width={100} height={100} className="object-cover" />
                </div>
              ) : (
                <div style={{ width: 100, height: 100, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.7)", background: MAIN, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 5px rgba(47,51,36,0.5)" }}>
                  <ProductImagePlaceholder size={36} color="rgba(255,255,255,0.7)" />
                </div>
              )}
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.5rem,4vw,2.2rem)", color: "#fff", margin: 0, fontWeight: 600 }}>
                {data.name}
              </h1>
            </div>
          </MenuHeaderBanner>

          {/* All categories */}
          <div className="t4-content">
            {categories.map((cat) => (
              <section key={cat.name} id={`cat-${cat.name}`} style={{ marginBottom: "1.75rem" }}>
                {/* Category title */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "1.4rem", fontWeight: 600, color: MAIN,
                  borderBottom: `1px solid ${LINE}`,
                  paddingBottom: "0.5rem", marginBottom: "1rem",
                }}>
                  <span style={{ color: ACCENT_T, fontSize: "0.9rem" }}>◆</span>
                  {cat.name}
                </div>

                {/* Product items */}
                {cat.items.map((p, idx) => {
                  const imgUrl = buildImgUrl(p.product_image?.[0]?.image_url);
                  return (
                    <button
                      key={p.id}
                      onClick={() => setDrawer(p)}
                      style={{
                        width: "100%", display: "flex", alignItems: "flex-start", gap: 12,
                        padding: "0.85rem 0", textAlign: "left",
                        background: "none", border: "none", cursor: "pointer",
                        borderBottom: idx < cat.items.length - 1 ? `1.5px dashed ${LINE}` : "none",
                        transition: "background 0.15s",
                      }}
                    >
                      {imgUrl ? (
                        <div style={{ position: "relative", width: 58, height: 58, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: `2px solid rgba(111,125,74,0.3)` }}>
                          <Image src={imgUrl} alt={p.name} fill sizes="58px" className="object-cover" />
                        </div>
                      ) : (
                        <div style={{ width: 58, height: 58, borderRadius: "50%", background: BG, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${LINE}` }}>
                          <ProductImagePlaceholder size={22} color="#ccc" />
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                          <span style={{ fontWeight: 600, fontSize: "0.95rem", color: DARK }}>{p.name}</span>
                          <span style={{ fontWeight: 700, fontSize: "0.95rem", color: ACCENT_T, flexShrink: 0 }}>{(p.price ?? 0).toFixed(2)} {currency}</span>
                        </div>
                        {p.description && (
                          <p style={{ margin: "3px 0 0", fontSize: "0.8rem", color: MUTED, lineHeight: 1.4 }}>{p.description}</p>
                        )}
                        <ProductCardMeta product={p} />
                      </div>
                    </button>
                  );
                })}
              </section>
            ))}
          </div>

          <MenuLastUpdatedFooter digitalMenu={data.digitalMenu} color={MUTED} borderColor={LINE} />
      </div>

      {drawer && (
        <ProductDrawer product={drawer} currency={currency} accentColor={ACCENT_T} onClose={() => setDrawer(null)} />
      )}

      {data.orderingEnabled && data.orderToken && data.orderProducts.length > 0 && (
        <OrderWidget menuId={menuId} orderToken={data.orderToken} tables={data.tables} orderProducts={data.orderProducts} accentColor={ACCENT_G} surfaceColor={MAIN} />
      )}
    </>
  );
}
