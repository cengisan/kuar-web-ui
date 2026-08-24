/**
 * Theme 6 — "Nordic Clean"
 * Pure white with sage/forest green accents, ultra-minimal Scandinavian feel.
 * DM Sans, 2-column card grid, airy and modern.
 */
import type { MenuApiData } from "@/types/menu";
import { MenuClientApp, type MenuThemeVariant } from "@/components/menu/MenuClientApp";

const THEME: MenuThemeVariant = {
  id: "menu6",

  bodyBg: "#f9fafb",
  bodyBgFixed: false,

  headerBg: "#1f2f1a",
  headerOverlay: "linear-gradient(180deg, rgba(31,47,26,0.40) 0%, rgba(31,47,26,0.88) 100%)",
  headerText: "#f0f7ee",
  headerSubtext: "rgba(240,247,238,0.65)",
  logoRingColor: "#6aab50",

  tileGradients: [
    "linear-gradient(135deg,#2e7d32 0%,#1b5e20 100%)",   // forest green
    "linear-gradient(135deg,#558b2f 0%,#33691e 100%)",   // olive green
    "linear-gradient(135deg,#00796b 0%,#004d40 100%)",   // teal green
    "linear-gradient(135deg,#4caf50 0%,#2e7d32 100%)",   // mid green
    "linear-gradient(135deg,#1b5e20 0%,#003300 100%)",   // deep forest
    "linear-gradient(135deg,#388e3c 0%,#1b5e20 100%)",   // sage
  ],
  tileOverlay: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.52) 60%, rgba(0,0,0,0.75) 100%)",
  tileTextColor: "#ffffff",

  productLayout: "grid",

  cardBg: "#ffffff",
  cardBorder: "#e5f0e0",
  cardShadow: "0 2px 12px rgba(30,70,20,0.07)",

  text: "#1a2e14",
  textMuted: "#6b8b60",
  accent: "#2e7d32",
  accentContrast: "#ffffff",

  navBg: "#ffffff",
  navBorder: "#e5f0e0",
  navText: "#1a2e14",

  backBtnBg: "rgba(46,125,50,0.12)",
  backBtnText: "#2e7d32",

  fontFamily: "'DM Sans', 'Inter', sans-serif",

  radius: "16px",

  orderAccent: "#2e7d32",
  orderSurface: "#1a2e14",
  orderText: "#f0f7ee",
};

interface Props {
  menuId: string;
  data: MenuApiData;
}

export default function MenuTheme6({ menuId, data }: Props) {
  return <MenuClientApp menuId={menuId} data={data} theme={THEME} />;
}
