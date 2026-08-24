/**
 * Theme 2 — "Warm Heritage"
 * Inspired by Murad's reference: warm cream/ivory background, burnt orange accent,
 * serif typography, classic text list with dotted price leaders.
 */
import type { MenuApiData } from "@/types/menu";
import { MenuClientApp, type MenuThemeVariant } from "@/components/menu/MenuClientApp";

const THEME: MenuThemeVariant = {
  id: "menu2",

  bodyBg: "#f5efe6",
  bodyBgFixed: false,

  headerBg: "#1c1209",
  headerOverlay: "linear-gradient(to bottom, rgba(28,18,9,0.55) 0%, rgba(28,18,9,0.88) 100%)",
  headerText: "#fffbf5",
  headerSubtext: "rgba(255,251,245,0.65)",
  logoRingColor: "#c9862a",

  tileGradients: [
    "linear-gradient(135deg,#c9862a 0%,#a86820 100%)",   // burnt orange
    "linear-gradient(135deg,#7c4a1e 0%,#5a3514 100%)",   // deep brown
    "linear-gradient(135deg,#b8732a 0%,#8c5520 100%)",   // amber
    "linear-gradient(135deg,#3d2b1a 0%,#5c3d25 100%)",   // dark espresso
    "linear-gradient(135deg,#d4924a 0%,#b07030 100%)",   // warm gold
  ],
  tileOverlay: "linear-gradient(to bottom, rgba(28,12,4,0.10) 0%, rgba(28,12,4,0.65) 70%, rgba(28,12,4,0.82) 100%)",
  tileTextColor: "#ffffff",

  productLayout: "list-text",
  dotLeader: true,

  cardBg: "#fffbf5",
  cardBorder: "#e8d5b8",
  cardShadow: "0 1px 4px rgba(120,80,30,0.08)",

  text: "#2c1a0a",
  textMuted: "#8a6545",
  accent: "#c9862a",
  accentContrast: "#ffffff",

  navBg: "#fffbf5",
  navBorder: "#e8d5b8",
  navText: "#2c1a0a",

  backBtnBg: "rgba(201,134,42,0.18)",
  backBtnText: "#c9862a",

  fontFamily: "'Playfair Display', Georgia, serif",
  headingFont: "'Playfair Display', serif",

  radius: "16px",

  orderAccent: "#c9862a",
  orderSurface: "#2c1a0a",
  orderText: "#fffbf5",
};

interface Props {
  menuId: string;
  data: MenuApiData;
}

export default function MenuTheme2({ menuId, data }: Props) {
  return <MenuClientApp menuId={menuId} data={data} theme={THEME} />;
}
