/**
 * Theme 5 — "Neon Modern"
 * Dark background with vibrant neon magenta/purple gradient accents.
 * Ultra-modern urban street food aesthetic, 2-column card grid.
 */
import type { MenuApiData } from "@/types/menu";
import { MenuClientApp, type MenuThemeVariant } from "@/components/menu/MenuClientApp";

const THEME: MenuThemeVariant = {
  id: "menu5",

  bodyBg: "#0c0c14",
  bodyBgFixed: false,

  headerBg: "#0c0c14",
  headerOverlay: "linear-gradient(180deg, rgba(12,12,20,0.20) 0%, rgba(12,12,20,0.88) 100%)",
  headerText: "#ffffff",
  headerSubtext: "rgba(255,255,255,0.55)",
  logoRingColor: "#c026d3",

  tileGradients: [
    "linear-gradient(135deg,#9333ea 0%,#c026d3 100%)",   // purple → magenta
    "linear-gradient(135deg,#e11d48 0%,#c026d3 100%)",   // rose → magenta
    "linear-gradient(135deg,#0ea5e9 0%,#7c3aed 100%)",   // cyan → violet
    "linear-gradient(135deg,#f97316 0%,#db2777 100%)",   // orange → pink
    "linear-gradient(135deg,#10b981 0%,#0ea5e9 100%)",   // emerald → sky
    "linear-gradient(135deg,#7c3aed 0%,#1d4ed8 100%)",   // violet → blue
  ],
  tileOverlay: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.80) 100%)",
  tileTextColor: "#ffffff",
  tileFeaturedAccent: "#c026d3",

  productLayout: "grid",

  cardBg: "#15151f",
  cardBorder: "rgba(192,38,211,0.20)",
  cardShadow: "0 4px 20px rgba(192,38,211,0.12)",

  text: "#f0f0ff",
  textMuted: "rgba(240,240,255,0.50)",
  accent: "#c026d3",
  accentContrast: "#ffffff",

  navBg: "#0c0c14",
  navBorder: "rgba(192,38,211,0.15)",
  navText: "#f0f0ff",

  backBtnBg: "rgba(192,38,211,0.20)",
  backBtnText: "#e879f9",

  fontFamily: "'DM Sans', 'Plus Jakarta Sans', sans-serif",

  radius: "16px",

  orderAccent: "linear-gradient(135deg,#9333ea,#c026d3)",
  orderSurface: "#15151f",
  orderText: "#ffffff",
};

interface Props {
  menuId: string;
  data: MenuApiData;
}

export default function MenuTheme5({ menuId, data }: Props) {
  return <MenuClientApp menuId={menuId} data={data} theme={THEME} />;
}
