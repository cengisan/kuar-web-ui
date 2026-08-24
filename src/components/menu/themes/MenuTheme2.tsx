import type { MenuApiData } from "@/types/menu";
import { MenuLayout, type ThemeConfig } from "../MenuLayout";

/**
 * Theme 2 — Classic (clean white, serif-inspired, elegant borders)
 */
const theme: ThemeConfig = {
  vars: {
    "--menu-bg": "#f9f6f1",
    "--menu-surface": "#ffffff",
    "--menu-text": "#1a1008",
    "--menu-text-muted": "#6b5e50",
    "--menu-accent": "#2d6a4f",
    "--menu-border": "rgba(0,0,0,0.09)",
    "--menu-header-bg": "#ffffff",
    "--menu-nav-bg": "#f9f6f1",
    "--menu-card-bg": "#ffffff",
    "--order-accent": "#2d6a4f",
    "--order-surface": "#1a2e25",
    "--order-text": "#f0faf5",
    "--order-input": "rgba(255,255,255,0.08)",
    background: "var(--menu-bg)",
    color: "var(--menu-text)",
    minHeight: "100svh",
    fontFamily: "'Georgia', 'Times New Roman', serif",
  },
  wrapperClass: "w-full",
  headerClass:
    "mx-auto max-w-3xl border-b px-6 pb-8 pt-10 text-center"
    + " [border-color:var(--menu-border)] [background:var(--menu-header-bg)]",
  navClass:
    "sticky top-0 z-30 border-b"
    + " [background:var(--menu-nav-bg)] [border-color:var(--menu-border)]",
  navButtonClass:
    "text-[color:var(--menu-text)] [border:1px_solid_var(--menu-border)]"
    + " hover:[background:var(--menu-accent)] hover:text-white hover:[border-color:transparent]",
  navButtonActiveClass: "[background:var(--menu-accent)] text-white",
  cardClass:
    "rounded-xl border shadow-sm [background:var(--menu-card-bg)] [border-color:var(--menu-border)]",
  sectionHeadingClass:
    "border-b pb-2 text-xl font-bold tracking-wide uppercase"
    + " [color:var(--menu-accent)] [border-color:var(--menu-border)]",
};

interface Props {
  menuId: string;
  data: MenuApiData;
}

export default function MenuTheme2({ menuId, data }: Props) {
  return <MenuLayout menuId={menuId} data={data} theme={theme} />;
}
