import type { MenuApiData } from "@/types/menu";
import { MenuLayout, type ThemeConfig } from "../MenuLayout";

/**
 * Theme 5 — Urban (dark charcoal, neon-orange/red accent, bold type)
 */
const theme: ThemeConfig = {
  vars: {
    "--menu-bg": "#111118",
    "--menu-surface": "#1c1c26",
    "--menu-text": "#f1f0ee",
    "--menu-text-muted": "#9998a8",
    "--menu-accent": "#ff4d00",
    "--menu-border": "rgba(255,77,0,0.14)",
    "--menu-header-bg": "#111118",
    "--menu-nav-bg": "#141420",
    "--menu-card-bg": "#1c1c26",
    "--order-accent": "#ff4d00",
    "--order-surface": "#0e0e16",
    "--order-text": "#f1f0ee",
    "--order-input": "rgba(255,255,255,0.07)",
    background: "var(--menu-bg)",
    color: "var(--menu-text)",
    minHeight: "100svh",
    fontFamily: "'Space Grotesk', 'DM Sans', system-ui, sans-serif",
  },
  wrapperClass: "w-full",
  headerClass:
    "mx-auto max-w-3xl px-6 pb-10 pt-12 text-center"
    + " [border-bottom:2px_solid_var(--menu-accent)]",
  navClass:
    "sticky top-0 z-30 border-b [background:var(--menu-nav-bg)] [border-color:var(--menu-border)]",
  navButtonClass:
    "text-[color:var(--menu-text-muted)] hover:text-[color:var(--menu-accent)] font-bold",
  navButtonActiveClass: "text-[color:var(--menu-accent)]",
  cardClass:
    "rounded-2xl [background:var(--menu-card-bg)] [border:1px_solid_var(--menu-border)]"
    + " hover:[border-color:var(--menu-accent)] transition-colors",
  sectionHeadingClass:
    "text-2xl font-black uppercase tracking-tight [color:var(--menu-accent)]",
};

interface Props {
  menuId: string;
  data: MenuApiData;
}

export default function MenuTheme5({ menuId, data }: Props) {
  return <MenuLayout menuId={menuId} data={data} theme={theme} />;
}
