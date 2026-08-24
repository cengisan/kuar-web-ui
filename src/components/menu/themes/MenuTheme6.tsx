import type { MenuApiData } from "@/types/menu";
import { MenuLayout, type ThemeConfig } from "../MenuLayout";

/**
 * Theme 6 — Fresh / Modern (teal-to-emerald gradient, airy white cards)
 */
const theme: ThemeConfig = {
  vars: {
    "--menu-bg": "linear-gradient(160deg, #e8f5e9 0%, #e0f7f6 100%)",
    "--menu-surface": "#ffffff",
    "--menu-text": "#0d3d2f",
    "--menu-text-muted": "#4a9e87",
    "--menu-accent": "#00897b",
    "--menu-border": "rgba(0,137,123,0.14)",
    "--menu-header-bg": "transparent",
    "--menu-nav-bg": "rgba(255,255,255,0.85)",
    "--menu-card-bg": "#ffffff",
    "--order-accent": "#00897b",
    "--order-surface": "#0d3d2f",
    "--order-text": "#e8f5e9",
    "--order-input": "rgba(255,255,255,0.08)",
    background: "linear-gradient(160deg, #e8f5e9 0%, #e0f7f6 100%)",
    backgroundAttachment: "fixed",
    color: "var(--menu-text)",
    minHeight: "100svh",
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
  },
  wrapperClass: "w-full",
  headerClass:
    "mx-auto max-w-3xl px-6 pb-10 pt-12 text-center",
  navClass:
    "sticky top-0 z-30 border-b backdrop-blur-sm"
    + " [background:var(--menu-nav-bg)] [border-color:var(--menu-border)]",
  navButtonClass:
    "text-[color:var(--menu-accent)] [border:1px_solid_var(--menu-border)]"
    + " hover:[background:var(--menu-accent)] hover:text-white hover:[border-color:transparent]",
  navButtonActiveClass: "[background:var(--menu-accent)] text-white",
  cardClass:
    "rounded-3xl border shadow-sm [background:var(--menu-card-bg)] [border-color:var(--menu-border)]",
  sectionHeadingClass:
    "text-xl font-bold [color:var(--menu-accent)]",
};

interface Props {
  menuId: string;
  data: MenuApiData;
}

export default function MenuTheme6({ menuId, data }: Props) {
  return <MenuLayout menuId={menuId} data={data} theme={theme} />;
}
