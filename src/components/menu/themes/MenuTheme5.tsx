"use client";

/**
 * Tema 5 — Vibrant Modern (Banner Tiles → Card Grid)
 * Yapı (menu-5 inspired): Sıcak beyaz/şeftali zemin (#fff4ef),
 * SOLID renk başlıklı header (gradient değil), kategori sayfasında
 * başlığın solunda renk çubuğu olan başlık, ürünler card grid.
 * Ana görünüm: tam genişlik BANNER TILE listesi (ürün fotoğraflı veya solid renkli).
 * Tile'a tıklayınca back-bar + ürün kartları. Plus Jakarta Sans.
 */

import { useState } from "react";
import Image from "next/image";
import type { MenuApiData, ProductData } from "@/types/menu";
import {
  buildImgUrl,
  groupCategories,
  useCurrency,
  firstProductImage,
  categoryDefaultImage,
  tileColor,
  ProductDrawer,
  OrderWidget,
} from "@/components/menu/MenuShared";

const BG = "#fff4ef";
const SURFACE = "#ffffff";
const PRIMARY = "#ff5436";
const TEXT_DARK = "#2b1712";
const MUTED = "#8a6f66";
const BORDER = "#ffe4d8";

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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        html,body{margin:0;padding:0;box-sizing:border-box}
      `}</style>

      <div style={{ background: BG, color: TEXT_DARK, minHeight: "100svh", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>

        {/* Solid color header */}
        <div style={{
          background: PRIMARY,
          padding: "2.75rem 1.5rem 2.25rem",
          textAlign: "center",
          borderRadius: "0 0 28px 28px",
          boxShadow: "0 8px 24px rgba(255,84,54,0.22)",
        }}>
          {logoUrl ? (
            <div style={{ display: "inline-block", width: 86, height: 86, borderRadius: "50%", overflow: "hidden", border: "3px solid rgba(255,255,255,0.9)", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", marginBottom: 10 }}>
              <Image src={logoUrl} alt={data.name} width={86} height={86} className="object-cover" />
            </div>
          ) : (
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 86, height: 86, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.15)", fontSize: 32, color: "#fff", marginBottom: 10 }}>🍽</div>
          )}
          <h1 style={{ fontSize: "clamp(1.4rem,5vw,2rem)", fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>{data.name}</h1>
          {data.digitalMenu.business_name && data.digitalMenu.business_name !== data.name && (
            <p style={{ margin: "4px 0 0", fontSize: "0.88rem", color: "rgba(255,255,255,0.8)" }}>{data.digitalMenu.business_name}</p>
          )}
        </div>

        {/* Back bar */}
        {activeCat && (
          <div style={{
            position: "sticky", top: 0, zIndex: 200,
            background: "rgba(255,244,239,0.94)",
            backdropFilter: "blur(12px)",
            padding: "0.7rem 1rem",
            borderBottom: "1px solid #ffe0d0",
          }}>
            <button
              onClick={() => setActiveCat(null)}
              style={{ background: "transparent", border: `1px solid ${PRIMARY}`, color: PRIMARY, borderRadius: 999, padding: "0.45rem 1.1rem", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}
            >
              ← Kategorilere Dön
            </button>
          </div>
        )}

        {/* Category banner list */}
        {!activeCat && (
          <div style={{ padding: "1.5rem 1rem 6rem", maxWidth: 640, margin: "0 auto" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {categories.map((cat, idx) => {
                const img = firstProductImage(cat.items) ?? categoryDefaultImage(cat.name);
                const solid = tileColor(idx);
                return (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCat(cat.name)}
                    style={{
                      position: "relative",
                      height: 130,
                      borderRadius: 22,
                      overflow: "hidden",
                      border: "none",
                      cursor: "pointer",
                      background: solid,
                      padding: 0,
                      boxShadow: "0 4px 12px rgba(255,84,54,0.12)",
                      transition: "transform 0.2s",
                    }}
                  >
                    {img && (
                      <Image src={img} alt={cat.name} fill className="object-cover" sizes="100vw" />
                    )}
                    {/* Overlay only over image */}
                    {img && (
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.42)" }} />
                    )}
                    <div style={{
                      position: "absolute", inset: 0,
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "0 1.25rem",
                    }}>
                      <span style={{
                        fontSize: "1.15rem", fontWeight: 700, color: "#fff",
                        textShadow: img ? "0 1px 6px rgba(0,0,0,0.5)" : "none",
                      }}>
                        {cat.name}
                      </span>
                      <div style={{
                        background: "rgba(255,255,255,0.25)",
                        border: "1px solid rgba(255,255,255,0.45)",
                        borderRadius: 999,
                        padding: "4px 14px",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        color: "#fff",
                      }}>
                        {cat.items.length} ürün →
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Product card grid */}
        {activeCat && (
          <div style={{ padding: "1.25rem 1rem 6rem", maxWidth: 640, margin: "0 auto" }}>
            {/* Category title with accent bar */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
              <span style={{ width: 4, height: "1.3rem", borderRadius: 4, background: PRIMARY, flexShrink: 0 }} />
              <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: TEXT_DARK }}>{activeCat}</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
              {activeItems.map((p) => {
                const imgUrl = buildImgUrl(p.product_image?.[0]?.image_url);
                const ep = p.extra_parameters;
                return (
                  <div
                    key={p.id}
                    onClick={() => setDrawer(p)}
                    style={{
                      background: SURFACE,
                      borderRadius: 16,
                      border: `1px solid ${BORDER}`,
                      overflow: "hidden",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "0 2px 8px rgba(255,84,54,0.07)",
                    }}
                  >
                    <div style={{ position: "relative", height: 130, background: "#ffe4d8", flexShrink: 0 }}>
                      {imgUrl ? (
                        <Image src={imgUrl} alt={p.name} fill className="object-cover" sizes="50vw" />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, color: "#ddd" }}>🍽</div>
                      )}
                      {ep?.is_new_item && (
                        <span style={{ position: "absolute", top: 7, left: 7, background: "#28a745", color: "#fff", borderRadius: 999, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>YENİ</span>
                      )}
                    </div>
                    <div style={{ padding: "0.8rem", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: "0.88rem", color: TEXT_DARK, lineHeight: 1.3 }}>{p.name}</p>
                      {p.description && (
                        <p style={{ margin: 0, fontSize: "0.75rem", color: MUTED, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {p.description}
                        </p>
                      )}
                      <p style={{ margin: "4px 0 0", fontWeight: 700, fontSize: "0.95rem", color: PRIMARY }}>{(p.price ?? 0).toFixed(2)} {currency}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {drawer && (
          <ProductDrawer product={drawer} currency={currency} accentColor={PRIMARY} onClose={() => setDrawer(null)} />
        )}

        {data.orderingEnabled && data.orderToken && data.orderProducts.length > 0 && (
          <OrderWidget menuId={menuId} orderToken={data.orderToken} tables={data.tables} orderProducts={data.orderProducts} accentColor={PRIMARY} surfaceColor="#2b1712" />
        )}
      </div>
    </>
  );
}
