import type { MenuApiData } from "@/types/menu";
import { MenuLayout, type ThemeConfig } from "../MenuLayout";

/**
 * Theme 3 — Minimal (light gray, clean, sans-serif, lots of white space)
 */
const theme: ThemeConfig = {
  vars: {
    "--menu-bg": "#f5f5f5",
    "--menu-surface": "#ffffff",
    "--menu-text": "#111111",
    "--menu-text-muted": "#6b7280",
    "--menu-accent": "#111111",
    "--menu-border": "rgba(0,0,0,0.08)",
    "--menu-header-bg": "#ffffff",
    "--menu-nav-bg": "#ffffff",
    "--menu-card-bg": "#ffffff",
    "--order-accent": "#111111",
    "--order-surface": "#1c1c1e",
    "--order-text": "#f5f5f5",
    "--order-input": "rgba(255,255,255,0.08)",
    background: "var(--menu-bg)",
    color: "var(--menu-text)",
    minHeight: "100svh",
    fontFamily: "'Inter', 'Helvetica Neue', system-ui, sans-serif",
  },
  wrapperClass: "w-full",
  headerClass:
    "mx-auto max-w-3xl px-6 pb-10 pt-12 text-center [background:var(--menu-header-bg)]",
  navClass:
    "sticky top-0 z-30 border-b [background:var(--menu-nav-bg)] [border-color:var(--menu-border)]",
  navButtonClass:
    "text-[color:var(--menu-text-muted)] text-xs uppercase tracking-widest"
    + " hover:[color:var(--menu-text)]",
  navButtonActiveClass: "[color:var(--menu-text)] font-bold",
  cardClass:
    "rounded-2xl border [background:var(--menu-card-bg)] [border-color:var(--menu-border)]",
  sectionHeadingClass:
    "text-xs font-bold uppercase tracking-widest [color:var(--menu-text-muted)]",
};

interface Props {
  menuId: string;
  data: MenuApiData;
}

export default function MenuTheme3({ menuId, data }: Props) {
  return <MenuLayout menuId={menuId} data={data} theme={theme} />;
}
