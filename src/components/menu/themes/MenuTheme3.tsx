"use client";

/**
 * Tema 3 — Clean Sidebar
 * Yapı (menu-3 inspired): Beyaz zemin, sol kenardan açılan HAMBURGER SIDEBAR,
 * sidebar'da kategori listesi, ana içerikte seçili kategorinin ürünleri
 * YATAY LİSTE (sol küçük kare resim + sağda isim/açıklama/fiyat) olarak görünür.
 * Playfair Display başlıklar, sage yeşili (#8c9a86) aksant.
 */

import { useState } from "react";
import Image from "next/image";
import type { MenuApiData, ProductData } from "@/types/menu";
import {
  buildImgUrl,
  groupCategories,
  useCurrency,
  ProductDrawer,
  MenuFeatureWidgets,
  ProductImagePlaceholder,
  ProductCardMeta,
  ProductPriceDisplay,
  MenuHeaderBanner,
  MenuLastUpdatedFooter,
} from "@/components/menu/MenuShared";
import { getMenuHeaderImage } from "@/config/menuHeaders";

const BG = "#ffffff";
const SIDEBAR_BG = "#f4f1ea";
const LINE = "#ebe6dd";
const DARK = "#201e1b";
const ACCENT = "#8c9a86";
const MUTED = "#8b867e";

interface Props { menuId: string; data: MenuApiData }

export default function MenuTheme3({ menuId, data }: Props) {
  const categories = groupCategories(data.products);
  const [activeCat, setActiveCat] = useState(categories[0]?.name ?? "");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawer, setDrawer] = useState<ProductData | null>(null);
  const currency = useCurrency(data);
  const logoUrl = buildImgUrl(data.digitalMenu.digital_menu_image?.[0]?.image_url);
  const activeItems = categories.find((c) => c.name === activeCat)?.items ?? [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');
        html,body{margin:0;padding:0;box-sizing:border-box}
      `}</style>

      <div style={{ background: BG, color: DARK, minHeight: "100svh", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>

        {/* Fixed menu trigger — top left */}
        {!sidebarOpen && (
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Kategorileri aç"
            style={{
              position: "fixed",
              top: 12,
              left: 12,
              zIndex: 200,
              width: 44,
              height: 44,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              background: BG,
              border: `1px solid ${LINE}`,
              borderRadius: 12,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(32,30,27,0.10)",
            }}
          >
            <span style={{ width: 20, height: 2, background: DARK, borderRadius: 2, display: "block" }} />
            <span style={{ width: 20, height: 2, background: DARK, borderRadius: 2, display: "block" }} />
            <span style={{ width: 20, height: 2, background: DARK, borderRadius: 2, display: "block" }} />
          </button>
        )}

        {/* Overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 2500, background: "rgba(0,0,0,0.55)" }}
          />
        )}

        {/* Sidebar */}
        <aside
          style={{
            position: "fixed", top: 0, left: 0, zIndex: 3000,
            width: 270, height: "100vh", overflowY: "auto",
            background: SIDEBAR_BG, borderRight: `1px solid ${LINE}`,
            boxShadow: "4px 0 24px rgba(0,0,0,0.07)",
            transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s ease",
            padding: "2rem 1.25rem 3rem",
          }}
        >
          {/* Sidebar header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", paddingBottom: "1.25rem", borderBottom: `1px solid ${LINE}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {logoUrl ? (
                <div style={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden", border: `1px solid ${LINE}` }}>
                  <Image src={logoUrl} alt={data.name} width={44} height={44} className="object-cover" />
                </div>
              ) : null}
              <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 600, fontSize: "1rem", color: DARK }}>{data.name}</span>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Menüyü kapat"
              style={{
                background: SIDEBAR_BG,
                border: `1px solid ${LINE}`,
                borderRadius: 10,
                cursor: "pointer",
                color: DARK,
                fontSize: "1.1rem",
                fontWeight: 600,
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              ←
            </button>
          </div>

          <p style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, fontWeight: 600, marginBottom: 10 }}>KATEGORİLER</p>

          <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {categories.map((cat) => {
              const active = cat.name === activeCat;
              return (
                <button
                  key={cat.name}
                  onClick={() => { setActiveCat(cat.name); setSidebarOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    width: "100%", padding: "0.7rem 0.9rem",
                    borderRadius: 10, border: "none", cursor: "pointer",
                    background: active ? ACCENT : "transparent",
                    color: active ? "#fff" : DARK,
                    fontWeight: active ? 600 : 400,
                    fontSize: "0.92rem",
                    textAlign: "left",
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: active ? "#fff" : ACCENT, flexShrink: 0 }} />
                  {cat.name}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <MenuHeaderBanner
          background={getMenuHeaderImage("menu3")}
          overlay="rgba(255,255,255,0.78)"
          minHeight={180}
          padding="2.75rem 1.25rem 1.25rem"
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            {logoUrl ? (
              <div style={{ width: 88, height: 88, borderRadius: "50%", overflow: "hidden", border: `2px solid ${ACCENT}`, boxShadow: "0 0 0 4px rgba(255,255,255,0.9), 0 4px 16px rgba(32,30,27,0.12)" }}>
                <Image src={logoUrl} alt={data.name} width={88} height={88} className="object-cover" />
              </div>
            ) : (
              <div style={{ width: 88, height: 88, borderRadius: "50%", border: `2px solid ${ACCENT}`, background: SIDEBAR_BG, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 4px rgba(255,255,255,0.9)" }}>
                <ProductImagePlaceholder size={32} color={MUTED} />
              </div>
            )}
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.3rem,4vw,1.75rem)", fontWeight: 700, color: DARK, margin: 0 }}>
              {data.name}
            </h1>
          </div>
        </MenuHeaderBanner>

        <div style={{ paddingLeft: 0 }}>
          {/* Sticky category bar */}
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 100,
              background: BG,
              borderBottom: `1px solid ${LINE}`,
              padding: "0.85rem 1rem 0.85rem 3.75rem",
              boxShadow: "0 1px 0 rgba(32,30,27,0.04)",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.25rem", fontWeight: 700, color: DARK, margin: 0, lineHeight: 1.2 }}>
                {activeCat}
              </h2>
              <p style={{ margin: "3px 0 0", fontSize: "0.78rem", color: MUTED }}>{activeItems.length} ürün</p>
            </div>
          </div>

          {/* Product list */}
          <div style={{ padding: "1rem 1rem 0", display: "flex", flexDirection: "column", gap: 12 }}>
            {activeItems.map((p) => {
              const imgUrl = buildImgUrl(p.product_image?.[0]?.image_url);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setDrawer(p)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "stretch",
                    textAlign: "left",
                    background: BG,
                    border: `1px solid ${LINE}`,
                    borderRadius: 14,
                    cursor: "pointer",
                    overflow: "hidden",
                    boxShadow: "0 2px 10px rgba(32,30,27,0.05)",
                    transition: "box-shadow 0.15s, transform 0.15s",
                  }}
                >
                  {imgUrl ? (
                    <div
                      style={{
                        position: "relative",
                        width: 112,
                        minHeight: 112,
                        flexShrink: 0,
                        background: SIDEBAR_BG,
                      }}
                    >
                      <Image src={imgUrl} alt={p.name} fill sizes="112px" className="object-cover" style={{ objectPosition: "center" }} />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: 112,
                        minHeight: 112,
                        flexShrink: 0,
                        background: SIDEBAR_BG,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRight: `1px solid ${LINE}`,
                      }}
                    >
                      <ProductImagePlaceholder size={28} color="#ccc" />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0, padding: "1rem 1rem 1rem 0.95rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: "0.98rem", color: DARK, lineHeight: 1.3 }}>{p.name}</p>
                      <ProductPriceDisplay product={p} currency={currency} accentColor={ACCENT} fontSize="0.95rem" style={{ margin: 0, flexShrink: 0 }} />
                    </div>
                    {p.description && (
                      <p style={{ margin: "5px 0 0", fontSize: "0.82rem", color: MUTED, lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {p.description}
                      </p>
                    )}
                    <ProductCardMeta product={p} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <MenuLastUpdatedFooter digitalMenu={data.digitalMenu} color={MUTED} borderColor={LINE} />

        {drawer && (
          <ProductDrawer product={drawer} currency={currency} accentColor={ACCENT} onClose={() => setDrawer(null)} />
        )}

        <MenuFeatureWidgets menuId={menuId} data={data} accentColor={ACCENT} surfaceColor="#33302b" />
      </div>
    </>
  );
}
