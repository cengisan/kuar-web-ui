import { assets } from "@/config/assets";
import type { DigitalMenu } from "@/types";

export function getMenuLogoUrl(menu: DigitalMenu): string | null {
  const logo =
    menu.digital_menu_image?.[0] ?? menu.images?.[0] ?? null;
  return (
    menu.image_url ||
    logo?.image_url ||
    logo?.url ||
    null
  );
}

export function getDefaultKuarLogo(theme: string) {
  return theme === "light" ? assets.logo.light : assets.logo.dark;
}
