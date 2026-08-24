import type { ComponentType } from "react";
import type { MenuApiData } from "@/types/menu";

// Each theme is a fully standalone "use client" component with its own layout.
import MenuTheme1 from "./themes/MenuTheme1"; // Neumorphic bej + yatay tab nav + grid
import MenuTheme2 from "./themes/MenuTheme2"; // Dark + kategori tile grid → ürün grid
import MenuTheme3 from "./themes/MenuTheme3"; // Clean beyaz + hamburger sidebar + liste
import MenuTheme4 from "./themes/MenuTheme4"; // Klasik scroll-all + dashed + thumbnail
import MenuTheme5 from "./themes/MenuTheme5"; // Vibrant şeftali + banner tile → card grid
import MenuTheme6 from "./themes/MenuTheme6"; // Urban sage + panel header + pill tabs + grid

export interface MenuThemeProps {
  menuId: string;
  data: MenuApiData;
}

const THEME_MAP: Record<string, ComponentType<MenuThemeProps>> = {
  menu1: MenuTheme1,
  menu2: MenuTheme2,
  menu3: MenuTheme3,
  menu4: MenuTheme4,
  menu5: MenuTheme5,
  menu6: MenuTheme6,
};

export function selectThemeComponent(theme: string): ComponentType<MenuThemeProps> {
  return THEME_MAP[theme] ?? MenuTheme1;
}

export { MenuTheme1, MenuTheme2, MenuTheme3, MenuTheme4, MenuTheme5, MenuTheme6 };
