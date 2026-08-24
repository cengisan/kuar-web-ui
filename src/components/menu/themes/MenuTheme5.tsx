"use client";

/**
 * Tema 5 — "Carbone Dark"
 * Referans görsel: Carbone Restaurant uygulaması
 *
 * Ana görünüm:
 *   - Koyu siyah zemin (#0d0d0d)
 *   - Üstte kompakt header: yuvarlak logo + restoran adı
 *   - Kategoriler: asimetrik bento grid (tam genişlik → iki yarım → tam → iki yarım…)
 *     Her tile gerçek yemek fotoğrafı arka plan, koyu overlay, beyaz bold text
 *
 * Kategori görünümü (tile'a tıklanınca):
 *   - Sticky back-bar
 *   - Kategori adı (metin başlık)
 *   - İlk ürün: tam genişlik hero kart
 *   - Diğer ürünler: küçük kare thumbnail + isim + açıklama + fiyat satırları
 *
 * Ürün tıklanınca: bottom sheet drawer
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

const BG = "#0d0d0d";
const SURFACE = "#181818";
const TEXT = "#f5f5f5";
const MUTED = "rgba(245,245,245,0.55)";
const ACCENT = "#ffffff";
const BORDER = "rgba(255,255,255,0.10)";

interface Props { menuId: string; data: MenuApiData }

export default function MenuTheme5({ menuId, data }: Props) {
  const categories = groupCategories(data.products);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<ProductData | null>(null);
  const currency = useCurrency(data);
  const logoUrl = buildImgUrl(data.digitalMenu.digital_menu_image?.[0]?.image_url);
  const activeItems = activeCat ? (categories.find((c) => c.name === activeCat)?.items ?? []) : [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');
        html,body{margin:0;padding:0;box-sizing:border-box}
        body{background:${BG};min-height:100vh}
      `}</style>

      <div style={{ background: BG, color: TEXT, minHeight: "100svh", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>

        <MenuHeaderBanner
          background={getMenuHeaderImage("menu5")}
          overlay="rgba(13,13,13,0.76)"
          minHeight={220}
          padding="1.75rem 1rem 1.5rem"
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            {logoUrl ? (
              <div style={{ width: 88, height: 88, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(255,255,255,0.85)", boxShadow: "0 0 0 5px rgba(13,13,13,0.55), 0 0 28px rgba(255,255,255,0.08)", flexShrink: 0 }}>
                <Image src={logoUrl} alt={data.name} width={88} height={88} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
              </div>
            ) : (
              <div style={{ width: 88, height: 88, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", background: SURFACE, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 5px rgba(13,13,13,0.55)" }}>
                <ProductImagePlaceholder size={28} color={MUTED} />
              </div>
            )}
            <div style={{ textAlign: "center" }}>
              <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.6rem", fontWeight: 600, margin: 0, letterSpacing: "0.06em", color: TEXT }}>
                {data.name}
              </h1>
              {data.digitalMenu.business_name && data.digitalMenu.business_name !== data.name && (
                <p style={{ margin: "3px 0 0", fontSize: "0.8rem", color: MUTED }}>{data.digitalMenu.business_name}</p>
              )}
            </div>
          </div>
        </MenuHeaderBanner>
        <div style={{ borderBottom: `1px solid ${BORDER}` }} />

        {/* ── Sticky back bar ── */}
        {activeCat && (
          <div style={{
            position: "sticky", top: 0, zIndex: 200,
            background: "rgba(13,13,13,0.92)",
            backdropFilter: "blur(12px)",
            padding: "0.75rem 1rem",
            borderBottom: `1px solid ${BORDER}`,
          }}>
            <button
              onClick={() => setActiveCat(null)}
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: TEXT, borderRadius: 999, padding: "0.45rem 1.1rem", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}
            >
              ← Menüye Dön
            </button>
          </div>
        )}

        {/* ── Category bento grid ── */}
        {!activeCat && (
          <div style={{ padding: "1rem 0.75rem 0" }}>
            {(() => {
              const nodes: React.ReactNode[] = [];
              let i = 0;
              while (i < categories.length) {
                const groupPos = i % 3;

                if (groupPos === 0) {
                  // Full-width tile
                  const cat = categories[i];
                  const img = firstProductImage(cat.items);
                  nodes.push(
                    <button
                      key={cat.name}
                      onClick={() => setActiveCat(cat.name)}
                      style={{
                        position: "relative", width: "100%", height: 200,
                        borderRadius: 10, overflow: "hidden",
                        border: `1px solid ${BORDER}`,
                        cursor: "pointer", marginBottom: 8, padding: 0,
                        background: SURFACE,
                        display: "block",
                      }}
                    >
                      {img && <Image src={img} alt={cat.name} fill style={{ objectFit: "cover" }} sizes="100vw" />}
                      {img && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />}
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.6rem", fontWeight: 700, color: img ? "#fff" : TEXT, letterSpacing: "0.08em", textTransform: "uppercase", textShadow: img ? "0 2px 8px rgba(0,0,0,0.6)" : "none" }}>
                          {cat.name}
                        </span>
                      </div>
                    </button>
                  );
                  i++;
                } else {
                  // Two half-width tiles
                  const pair = categories.slice(i, i + 2);
                  nodes.push(
                    <div key={`pair-${i}`} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                      {pair.map((cat) => {
                        const img = firstProductImage(cat.items);
                        return (
                          <button
                            key={cat.name}
                            onClick={() => setActiveCat(cat.name)}
                            style={{
                              position: "relative", height: 160,
                              borderRadius: 10, overflow: "hidden",
                              border: `1px solid ${BORDER}`,
                              cursor: "pointer", padding: 0, background: SURFACE,
                            }}
                          >
                            {img && <Image src={img} alt={cat.name} fill style={{ objectFit: "cover" }} sizes="50vw" />}
                            {img && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />}
                            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 8px" }}>
                              <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.1rem", fontWeight: 700, color: img ? "#fff" : TEXT, letterSpacing: "0.06em", textTransform: "uppercase", textAlign: "center", textShadow: img ? "0 2px 6px rgba(0,0,0,0.6)" : "none" }}>
                                {cat.name}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  );
                  i += pair.length;
                }
              }
              return nodes;
            })()}
          </div>
        )}

        {/* ── Product view ── */}
        {activeCat && (
          <div style={{ paddingBottom: 0 }}>
            <div style={{ padding: "1.15rem 1rem", borderBottom: `1px solid ${BORDER}` }}>
              <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.6rem", fontWeight: 700, color: TEXT, margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {activeCat}
              </h2>
            </div>

            <div style={{ padding: "1rem 0.75rem" }}>
              {activeItems.map((p, idx) => {
                const imgUrl = buildImgUrl(p.product_image?.[0]?.image_url);

                if (idx === 0) {
                  return (
                    <button
                      key={p.id}
                      onClick={() => setDrawer(p)}
                      style={{
                        position: "relative", width: "100%", height: 220,
                        borderRadius: 10, overflow: "hidden", border: "none",
                        cursor: "pointer", marginBottom: 10, padding: 0,
                        background: SURFACE, display: "block",
                      }}
                    >
                      {imgUrl ? (
                        <Image src={imgUrl} alt={p.name} fill style={{ objectFit: "cover" }} sizes="100vw" />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: "#222", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <ProductImagePlaceholder size={40} color="#555" />
                        </div>
                      )}
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
                      <ProductExtraLabels product={p} layout="overlay" />
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 6, background: "rgba(0,0,0,0.7)", padding: "0.9rem 1rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "#fff" }}>{p.name}</span>
                          <ProductPriceDisplay
                            product={p}
                            currency={currency}
                            accentColor="#fff"
                            originalColor="rgba(255,255,255,0.55)"
                            fontSize="1.05rem"
                            style={{ flexShrink: 0, marginLeft: 8 }}
                          />
                        </div>
                        {p.description && (
                          <p style={{ margin: "3px 0 0", fontSize: "0.78rem", color: "rgba(255,255,255,0.65)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {p.description}
                          </p>
                        )}
                        <ProductCardMeta product={p} variant="dark" showLabels={false} />
                      </div>
                    </button>
                  );
                }

                return (
                  <button
                    key={p.id}
                    onClick={() => setDrawer(p)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 12,
                      padding: "0.85rem 0.75rem", border: "none", background: "none",
                      cursor: "pointer", textAlign: "left",
                      borderBottom: idx < activeItems.length - 1 ? `1px solid ${BORDER}` : "none",
                    }}
                  >
                    {imgUrl ? (
                      <div style={{ width: 64, height: 64, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                        <Image src={imgUrl} alt={p.name} width={64} height={64} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                      </div>
                    ) : (
                      <div style={{ width: 64, height: 64, borderRadius: 8, background: SURFACE, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ProductImagePlaceholder size={22} color="#555" />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: "0.93rem", color: TEXT, lineHeight: 1.3 }}>{p.name}</p>
                      {p.description && (
                        <p style={{ margin: "3px 0 0", fontSize: "0.78rem", color: MUTED, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {p.description}
                        </p>
                      )}
                      <ProductCardMeta product={p} variant="dark" />
                    </div>
                    <ProductPriceDisplay
                      product={p}
                      currency={currency}
                      accentColor={TEXT}
                      fontSize="0.95rem"
                      style={{ flexShrink: 0, marginLeft: 6, textAlign: "right" }}
                      currencyOnNewLine
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <MenuLastUpdatedFooter digitalMenu={data.digitalMenu} color={MUTED} borderColor={BORDER} />

        {drawer && (
          <ProductDrawer product={drawer} currency={currency} accentColor="#ffffff" onClose={() => setDrawer(null)} />
        )}

        {data.orderingEnabled && data.orderToken && data.orderProducts.length > 0 && (
          <OrderWidget menuId={menuId} orderToken={data.orderToken} tables={data.tables} orderProducts={data.orderProducts} accentColor="#ffffff" surfaceColor={SURFACE} />
        )}
      </div>
    </>
  );
}
