import type { MenuApiData } from "@/types/menu";
import { MenuLayout, type ThemeConfig } from "../MenuLayout";

/**
 * Theme 1 — Café Warm (neumorphic warm brown palette)
 */
const theme: ThemeConfig = {
  vars: {
    "--menu-bg": "#e9e0d2",
    "--menu-surface": "#ece3d5",
    "--menu-text": "#5c3317",
    "--menu-text-muted": "#8a7862",
    "--menu-accent": "#8b4513",
    "--menu-border": "rgba(92,51,23,0.12)",
    "--menu-header-bg": "#ece3d5",
    "--menu-nav-bg": "#e4dbd0",
    "--menu-card-bg": "#f5efe6",
    "--order-accent": "#8b4513",
    "--order-surface": "#3d2817",
    "--order-text": "#f5efe6",
    "--order-input": "rgba(255,255,255,0.08)",
    background: "var(--menu-bg)",
    color: "var(--menu-text)",
    minHeight: "100svh",
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
  },
  wrapperClass: "w-full",
  headerClass:
    "mx-auto max-w-3xl px-6 pb-8 pt-10 text-center",
  navClass:
    "sticky top-0 z-30 border-b shadow-sm"
    + " [background:var(--menu-nav-bg)] [border-color:var(--menu-border)]",
  navButtonClass:
    "text-[color:var(--menu-text)] hover:[background:var(--menu-accent)] hover:text-white",
  navButtonActiveClass: "[background:var(--menu-accent)] text-white",
  cardClass:
    "rounded-2xl shadow-md [background:var(--menu-card-bg)] [border:1px_solid_var(--menu-border)]",
  sectionHeadingClass:
    "text-xl font-bold [color:var(--menu-text)]",
};

interface Props {
  menuId: string;
  data: MenuApiData;
}

export default function MenuTheme1({ menuId, data }: Props) {
  return <MenuLayout menuId={menuId} data={data} theme={theme} />;
}
