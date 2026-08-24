import type { MenuApiData } from "@/types/menu";
import { MenuLayout, type ThemeConfig } from "../MenuLayout";

/**
 * Theme 4 — Elegant (dark navy background, gold accents, upscale feel)
 */
const theme: ThemeConfig = {
  vars: {
    "--menu-bg": "#0d1b2a",
    "--menu-surface": "#1b2b3d",
    "--menu-text": "#f0e6d2",
    "--menu-text-muted": "#8fa3b8",
    "--menu-accent": "#d4af37",
    "--menu-border": "rgba(212,175,55,0.18)",
    "--menu-header-bg": "#0d1b2a",
    "--menu-nav-bg": "#0f1e2e",
    "--menu-card-bg": "#1b2b3d",
    "--order-accent": "#d4af37",
    "--order-surface": "#0d1b2a",
    "--order-text": "#f0e6d2",
    "--order-input": "rgba(255,255,255,0.06)",
    background: "var(--menu-bg)",
    color: "var(--menu-text)",
    minHeight: "100svh",
    fontFamily: "'Playfair Display', 'Georgia', serif",
  },
  wrapperClass: "w-full",
  headerClass:
    "mx-auto max-w-3xl border-b px-6 pb-10 pt-12 text-center"
    + " [border-color:var(--menu-border)]",
  navClass:
    "sticky top-0 z-30 border-b [background:var(--menu-nav-bg)] [border-color:var(--menu-border)]",
  navButtonClass:
    "text-[color:var(--menu-text-muted)] hover:text-[color:var(--menu-accent)]"
    + " [border:1px_solid_var(--menu-border)] hover:[border-color:var(--menu-accent)]",
  navButtonActiveClass: "text-[color:var(--menu-accent)] [border-color:var(--menu-accent)]",
  cardClass:
    "rounded-xl border [background:var(--menu-card-bg)] [border-color:var(--menu-border)]"
    + " hover:[border-color:var(--menu-accent)] transition-colors",
  sectionHeadingClass:
    "text-xl font-bold italic tracking-wide [color:var(--menu-accent)]",
};

interface Props {
  menuId: string;
  data: MenuApiData;
}

export default function MenuTheme4({ menuId, data }: Props) {
  return <MenuLayout menuId={menuId} data={data} theme={theme} />;
}
