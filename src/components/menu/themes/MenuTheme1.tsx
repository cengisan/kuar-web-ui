/**
 * Theme 1 — "Dark Street"
 * Inspired by Carbone reference: pure black, food photos as tiles,
 * bold sans-serif uppercase headings, list-hero product layout.
 */
import type { MenuApiData } from "@/types/menu";
import { MenuClientApp, type MenuThemeVariant } from "@/components/menu/MenuClientApp";

const THEME: MenuThemeVariant = {
  id: "menu1",

  bodyBg: "#0a0a0a",
  bodyBgFixed: false,

  headerBg: "#0a0a0a",
  headerOverlay: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.82) 100%)",
  headerText: "#ffffff",
  headerSubtext: "rgba(255,255,255,0.55)",
  logoRingColor: "#ffffff",

  tileGradients: [
    "linear-gradient(135deg,#1a1a1a 0%,#2d2d2d 100%)",
    "linear-gradient(135deg,#1c1c1c 0%,#333 100%)",
    "linear-gradient(135deg,#111 0%,#262626 100%)",
    "linear-gradient(135deg,#0d0d0d 0%,#2a2a2a 100%)",
  ],
  tileOverlay: "linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.68) 60%, rgba(0,0,0,0.82) 100%)",
  tileTextColor: "#ffffff",

  productLayout: "list-hero",

  cardBg: "#161616",
  cardBorder: "#2a2a2a",
  cardShadow: "none",

  text: "#f0f0f0",
  textMuted: "rgba(255,255,255,0.50)",
  accent: "#ffffff",
  accentContrast: "#000000",

  navBg: "#0a0a0a",
  navBorder: "#1f1f1f",
  navText: "#ffffff",

  backBtnBg: "rgba(255,255,255,0.18)",
  backBtnText: "#ffffff",

  fontFamily: "'Oswald', 'Plus Jakarta Sans', sans-serif",
  headingFont: "'Oswald', sans-serif",

  radius: "12px",

  orderAccent: "#ffffff",
  orderSurface: "#111111",
  orderText: "#000000",
};

interface Props {
  menuId: string;
  data: MenuApiData;
}

export default function MenuTheme1({ menuId, data }: Props) {
  return <MenuClientApp menuId={menuId} data={data} theme={THEME} />;
}
