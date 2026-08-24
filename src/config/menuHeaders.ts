import type { StaticImageData } from "next/image";
import header1 from "@assets/header/header-1.jpg";
import header2 from "@assets/header/header-2.jpg";
import header3 from "@assets/header/header-3.jpg";
import header4 from "@assets/header/header-4.jpg";
import header5 from "@assets/header/header-5.jpg";
import header6 from "@assets/header/header-6.jpg";

/** Static header backgrounds — one per menu theme (menu1 … menu6). */
export const MENU_HEADER_IMAGES: Record<string, StaticImageData> = {
  menu1: header1,
  menu2: header2,
  menu3: header3,
  menu4: header4,
  menu5: header5,
  menu6: header6,
};

export function getMenuHeaderImage(theme: string): StaticImageData {
  return MENU_HEADER_IMAGES[theme] ?? header1;
}
