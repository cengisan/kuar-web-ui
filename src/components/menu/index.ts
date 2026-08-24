import type { ComponentType } from "react";
import type { MenuApiData } from "@/types/menu";
import MenuTheme1 from "./themes/MenuTheme1";
import MenuTheme2 from "./themes/MenuTheme2";
import MenuTheme3 from "./themes/MenuTheme3";
import MenuTheme4 from "./themes/MenuTheme4";
import MenuTheme5 from "./themes/MenuTheme5";
import MenuTheme6 from "./themes/MenuTheme6";

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
