/**
 * Theme 3 — "Midnight Navy"
 * Deep navy/indigo with gold accents, Art Deco-inspired luxury feel.
 * Cormorant Garamond serif, 2-column card grid product layout.
 */
import type { MenuApiData } from "@/types/menu";
import { MenuClientApp, type MenuThemeVariant } from "@/components/menu/MenuClientApp";

const THEME: MenuThemeVariant = {
  id: "menu3",

  bodyBg: "#0d1117",
  bodyBgFixed: false,

  headerBg: "#0d1117",
  headerOverlay: "linear-gradient(180deg, rgba(13,17,23,0.25) 0%, rgba(13,17,23,0.90) 100%)",
  headerText: "#e8d5a0",
  headerSubtext: "rgba(232,213,160,0.60)",
  logoRingColor: "#c9a846",

  tileGradients: [
    "linear-gradient(135deg,#1a2035 0%,#0d1730 100%)",
    "linear-gradient(135deg,#0f1c3a 0%,#1a2850 100%)",
    "linear-gradient(135deg,#141e30 0%,#243b55 100%)",
    "linear-gradient(135deg,#0d1117 0%,#1a2a40 100%)",
    "linear-gradient(135deg,#162030 0%,#1e3050 100%)",
  ],
  tileOverlay: "linear-gradient(to bottom, rgba(13,17,35,0.20) 0%, rgba(13,17,35,0.72) 65%, rgba(13,17,35,0.92) 100%)",
  tileTextColor: "#e8d5a0",
  tileFeaturedAccent: "#c9a846",

  productLayout: "grid",

  cardBg: "#131b2e",
  cardBorder: "rgba(201,168,70,0.20)",
  cardShadow: "0 4px 16px rgba(0,0,0,0.4)",

  text: "#e8d5a0",
  textMuted: "rgba(232,213,160,0.55)",
  accent: "#c9a846",
  accentContrast: "#0d1117",

  navBg: "#0d1117",
  navBorder: "rgba(201,168,70,0.15)",
  navText: "#e8d5a0",

  backBtnBg: "rgba(201,168,70,0.18)",
  backBtnText: "#c9a846",

  fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
  headingFont: "'Cormorant Garamond', serif",

  radius: "14px",

  orderAccent: "#c9a846",
  orderSurface: "#131b2e",
  orderText: "#0d1117",
};

interface Props {
  menuId: string;
  data: MenuApiData;
}

export default function MenuTheme3({ menuId, data }: Props) {
  return <MenuClientApp menuId={menuId} data={data} theme={THEME} />;
}
