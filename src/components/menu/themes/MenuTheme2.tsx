"use client";

/**
 * Tema 2 — Dark Elegant (Category Grid → Product Grid)
 * Yapı (menu-2 inspired): Neredeyse siyah zemin, ahşap doku header,
 * KATEGORİ TILE GRID (3 kolon, image + overlay + isim altında),
 * tile'a tıklayınca sticky back-bar + ürün card grid görünür.
 * Cormorant Garamond serif. Altın aksant. Gradient yok.
 */

import { useState } from "react";
import Image from "next/image";
import type { MenuApiData, ProductData } from "@/types/menu";
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
  ProductPriceDisplay,
  MenuHeaderBanner,
  MenuLastUpdatedFooter,
} from "@/components/menu/MenuShared";
import { getMenuHeaderImage } from "@/config/menuHeaders";

const BG = "#0b0a09";
const SURFACE = "#17120e";
const GOLD = "#c9a86a";
const TEXT = "#f3ece0";
const MUTED = "#b6aa96";
const CARD_BORDER = "rgba(201,168,106,0.18)";

interface Props { menuId: string; data: MenuApiData }

export default function MenuTheme2({ menuId, data }: Props) {
  const categories = groupCategories(data.products);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<ProductData | null>(null);
  const currency = useCurrency(data);
  const logoUrl = buildImgUrl(data.digitalMenu.digital_menu_image?.[0]?.image_url);
  const activeItems = activeCat ? (categories.find((c) => c.name === activeCat)?.items ?? []) : [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');
        html,body{margin:0;padding:0;box-sizing:border-box}
      `}</style>

      <div style={{ background: BG, color: TEXT, minHeight: "100svh", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>

        <MenuHeaderBanner
          background={getMenuHeaderImage("menu2")}
          overlay="rgba(11,10,9,0.72)"
          minHeight={250}
          padding="4rem 1.5rem 3rem"
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            {logoUrl ? (
              <div style={{ width: 108, height: 108, borderRadius: "50%", overflow: "hidden", border: `3px solid ${GOLD}`, boxShadow: `0 0 0 5px rgba(11,10,9,0.6), 0 0 32px rgba(201,168,106,0.35)` }}>
                <Image src={logoUrl} alt={data.name} width={108} height={108} className="object-cover" />
              </div>
            ) : (
              <div style={{ width: 108, height: 108, borderRadius: "50%", border: `3px solid ${GOLD}`, background: SURFACE, display: "flex", alignItems: "center", justifyContent: "center", color: MUTED, boxShadow: `0 0 0 5px rgba(11,10,9,0.6)` }}>
                <ProductImagePlaceholder size={36} color={MUTED} />
              </div>
            )}
            <div>
              <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.8rem,5vw,2.8rem)", fontWeight: 600, margin: 0, color: TEXT, letterSpacing: "0.05em" }}>
                {data.name}
              </h1>
              <div style={{ width: 60, height: 1, background: GOLD, margin: "10px auto 0" }} />
            </div>
          </div>
        </MenuHeaderBanner>

        {/* Sticky back bar (shown when a category is active) */}
        {activeCat && (
          <div style={{ position: "sticky", top: 0, zIndex: 200, background: "rgba(11,10,9,0.92)", backdropFilter: "blur(12px)", padding: "0.75rem 1rem", borderBottom: `1px solid rgba(201,168,106,0.2)` }}>
            <button
              onClick={() => setActiveCat(null)}
              style={{ background: "transparent", border: `1px solid rgba(201,168,106,0.45)`, borderRadius: 999, padding: "0.5rem 1.2rem", fontSize: "0.9rem", fontWeight: 600, color: GOLD, cursor: "pointer" }}
            >
              ← Kategorilere Dön
            </button>
          </div>
        )}

        {/* Category tile grid */}
        {!activeCat && (
          <div style={{ padding: "2rem 1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 14 }}>
              {categories.map((cat) => {
                const img = firstProductImage(cat.items);
                return (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCat(cat.name)}
                    style={{
                      position: "relative",
                      height: 200,
                      borderRadius: 12,
                      overflow: "hidden",
                      border: `1px solid ${CARD_BORDER}`,
                      cursor: "pointer",
                      background: SURFACE,
                      padding: 0,
                    }}
                  >
                    {img && (
                      <Image src={img} alt={cat.name} fill className="object-cover" sizes="(max-width:640px) 50vw, 33vw" />
                    )}
                    {img && (
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />
                    )}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "1rem 0.75rem 0.85rem",
                        borderBottom: img ? `2px solid ${GOLD}` : "none",
                        fontFamily: "'Cormorant Garamond',serif",
                        fontSize: "1.2rem",
                        fontWeight: 600,
                        color: img ? "#fff" : GOLD,
                        textAlign: "center",
                        letterSpacing: "0.03em",
                      }}
                    >
                      {cat.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Product card grid */}
        {activeCat && (
          <div style={{ padding: "2rem 1rem 0" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.8rem", fontWeight: 600, color: GOLD, marginBottom: "1.25rem", paddingBottom: "0.5rem", borderBottom: `1px solid rgba(201,168,106,0.25)` }}>
              {activeCat}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 14 }}>
              {activeItems.map((p) => {
                const imgUrl = buildImgUrl(p.product_image?.[0]?.image_url);
                return (
                  <div
                    key={p.id}
                    onClick={() => setDrawer(p)}
                    style={{ background: SURFACE, borderRadius: 12, border: `1px solid ${CARD_BORDER}`, overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column", boxShadow: "0 6px 20px rgba(0,0,0,0.55)" }}
                  >
                    <div style={{ position: "relative", height: 140, background: "#1a1008", flexShrink: 0 }}>
                      {imgUrl ? (
                        <Image src={imgUrl} alt={p.name} fill className="object-cover" sizes="(max-width:640px) 50vw, 33vw" />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <ProductImagePlaceholder size={32} color={MUTED} />
                        </div>
                      )}
                      <ProductExtraLabels product={p} layout="overlay" />
                    </div>
                    <div style={{ padding: "0.85rem 0.8rem", flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                      <p style={{ margin: 0, fontFamily: "'Cormorant Garamond',serif", fontSize: "1.1rem", fontWeight: 600, color: TEXT, lineHeight: 1.2 }}>{p.name}</p>
                      {p.description && (
                        <p style={{ margin: 0, fontSize: "0.78rem", color: MUTED, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {p.description}
                        </p>
                      )}
                      <ProductCardMeta product={p} variant="dark" showLabels={false} />
                      <p style={{ margin: "4px 0 0" }}>
                        <ProductPriceDisplay product={p} currency={currency} accentColor={GOLD} fontSize="1rem" />
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <MenuLastUpdatedFooter digitalMenu={data.digitalMenu} color={MUTED} borderColor="rgba(255,255,255,0.08)" />

        {drawer && (
          <ProductDrawer product={drawer} currency={currency} accentColor={GOLD} onClose={() => setDrawer(null)} />
        )}

        {data.orderingEnabled && data.orderToken && data.orderProducts.length > 0 && (
          <OrderWidget menuId={menuId} orderToken={data.orderToken} tables={data.tables} orderProducts={data.orderProducts} accentColor={GOLD} surfaceColor={SURFACE} />
        )}
      </div>
    </>
  );
}
