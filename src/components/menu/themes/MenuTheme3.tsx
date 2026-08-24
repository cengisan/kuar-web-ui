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
  OrderWidget,
} from "@/components/menu/MenuShared";

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

        {/* Hamburger button */}
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Menüyü aç"
          style={{
            position: "fixed", top: 14, left: 14, zIndex: 3001,
            background: BG, border: `1px solid ${LINE}`, borderRadius: 12,
            padding: "10px 12px", cursor: "pointer",
            boxShadow: "0 1px 4px rgba(32,30,27,0.08)",
            display: "flex", flexDirection: "column", gap: 5,
          }}
        >
          <span style={{ width: 22, height: 2, background: DARK, borderRadius: 2, display: "block" }} />
          <span style={{ width: 22, height: 2, background: DARK, borderRadius: 2, display: "block" }} />
          <span style={{ width: 22, height: 2, background: DARK, borderRadius: 2, display: "block" }} />
        </button>

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
              onClick={() => setSidebarOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: MUTED, padding: 4 }}
            >✕</button>
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
        <div style={{ paddingLeft: 0, paddingTop: 60 }}>
          {/* Category header */}
          <div style={{ padding: "1rem 1.25rem 0.75rem", borderBottom: `1px solid ${LINE}` }}>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.6rem", fontWeight: 700, color: DARK, margin: 0 }}>
              {activeCat}
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: MUTED }}>{activeItems.length} ürün</p>
          </div>

          {/* Horizontal list items */}
          <div style={{ padding: "0.5rem 0 6rem" }}>
            {activeItems.map((p, idx) => {
              const imgUrl = buildImgUrl(p.product_image?.[0]?.image_url);
              const ep = p.extra_parameters;
              return (
                <button
                  key={p.id}
                  onClick={() => setDrawer(p)}
                  style={{
                    width: "100%", display: "flex", alignItems: "flex-start", gap: 14,
                    padding: "1rem 1.25rem", textAlign: "left",
                    background: "none", border: "none", cursor: "pointer",
                    borderBottom: idx < activeItems.length - 1 ? `1px solid ${LINE}` : "none",
                    transition: "background 0.15s",
                  }}
                >
                  {/* Thumbnail */}
                  {imgUrl ? (
                    <div style={{ width: 70, height: 70, borderRadius: 10, overflow: "hidden", flexShrink: 0, border: `1px solid ${LINE}` }}>
                      <Image src={imgUrl} alt={p.name} width={70} height={70} className="object-cover" />
                    </div>
                  ) : (
                    <div style={{ width: 70, height: 70, borderRadius: 10, background: SIDEBAR_BG, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#ccc" }}>
                      🍽
                    </div>
                  )}
                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: "0.95rem", color: DARK, lineHeight: 1.3 }}>{p.name}</p>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: "0.95rem", color: ACCENT, flexShrink: 0 }}>{(p.price ?? 0).toFixed(2)} {currency}</p>
                    </div>
                    {p.description && (
                      <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: MUTED, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {p.description}
                      </p>
                    )}
                    {ep && (ep.is_new_item || ep.is_campaign) && (
                      <div style={{ display: "flex", gap: 5, marginTop: 5 }}>
                        {ep.is_new_item && <span style={{ background: "#28a745", color: "#fff", borderRadius: 999, padding: "1px 8px", fontSize: "0.7rem", fontWeight: 700 }}>YENİ</span>}
                        {ep.is_campaign && <span style={{ background: "#ffc107", color: "#222", borderRadius: 999, padding: "1px 8px", fontSize: "0.7rem", fontWeight: 700 }}>KAMPANYA</span>}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {drawer && (
          <ProductDrawer product={drawer} currency={currency} accentColor={ACCENT} onClose={() => setDrawer(null)} />
        )}

        {data.orderingEnabled && data.orderToken && data.orderProducts.length > 0 && (
          <OrderWidget menuId={menuId} orderToken={data.orderToken} tables={data.tables} orderProducts={data.orderProducts} accentColor={ACCENT} surfaceColor="#33302b" />
        )}
      </div>
    </>
  );
}
