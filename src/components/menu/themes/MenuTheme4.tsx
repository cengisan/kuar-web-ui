/**
 * Theme 4 — "Rustic Earth"
 * Warm terracotta/clay tones, Playfair Display, café/bistro feel.
 * Horizontal thumbnail list product layout — earthy & cozy.
 */
import type { MenuApiData } from "@/types/menu";
import { MenuClientApp, type MenuThemeVariant } from "@/components/menu/MenuClientApp";

const THEME: MenuThemeVariant = {
  id: "menu4",

  bodyBg: "linear-gradient(160deg,#fdf4ea 0%,#f2e2cc 100%)",
  bodyBgFixed: true,

  headerBg: "#3d1f0d",
  headerOverlay: "linear-gradient(180deg, rgba(61,31,13,0.50) 0%, rgba(61,31,13,0.86) 100%)",
  headerText: "#fdf4ea",
  headerSubtext: "rgba(253,244,234,0.65)",
  logoRingColor: "#e07a40",

  tileGradients: [
    "linear-gradient(135deg,#c06a3a 0%,#8c3e18 100%)",   // terracotta
    "linear-gradient(135deg,#8b5e3c 0%,#6b3e20 100%)",   // clay
    "linear-gradient(135deg,#d4835a 0%,#b0603a 100%)",   // salmon
    "linear-gradient(135deg,#7a4527 0%,#5c3018 100%)",   // brown
    "linear-gradient(135deg,#b8764a 0%,#8c5530 100%)",   // warm brown
  ],
  tileOverlay: "linear-gradient(to bottom, rgba(61,20,8,0.12) 0%, rgba(61,20,8,0.60) 60%, rgba(61,20,8,0.82) 100%)",
  tileTextColor: "#fdf4ea",

  productLayout: "list-thumbnail",

  cardBg: "#fffbf5",
  cardBorder: "#e8d0b0",
  cardShadow: "0 2px 8px rgba(100,50,20,0.08)",

  text: "#3d1f0d",
  textMuted: "#8a6040",
  accent: "#c06a3a",
  accentContrast: "#ffffff",

  navBg: "#fffbf5",
  navBorder: "#e8d0b0",
  navText: "#3d1f0d",

  backBtnBg: "rgba(192,106,58,0.15)",
  backBtnText: "#c06a3a",

  fontFamily: "'Playfair Display', Georgia, serif",
  headingFont: "'Playfair Display', serif",

  radius: "14px",

  orderAccent: "#c06a3a",
  orderSurface: "#3d1f0d",
  orderText: "#fdf4ea",
};

interface Props {
  menuId: string;
  data: MenuApiData;
}

export default function MenuTheme4({ menuId, data }: Props) {
  return <MenuClientApp menuId={menuId} data={data} theme={THEME} />;
}
