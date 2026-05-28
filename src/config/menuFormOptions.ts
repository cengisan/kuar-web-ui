import { assets } from "@/config/assets";
import type { StaticImageData } from "next/image";

export const menuCurrencies = [
  { label: "Türk Lirası (₺)", value: "TRY", symbol: "₺" },
  { label: "Amerikan Doları ($)", value: "USD", symbol: "$" },
  { label: "Euro (€)", value: "EUR", symbol: "€" },
  { label: "İngiliz Sterlini (£)", value: "GBP", symbol: "£" },
  { label: "Japon Yeni (¥)", value: "JPY", symbol: "¥" },
  { label: "Rus Rublesi (₽)", value: "RUB", symbol: "₽" },
  { label: "Çin Yuanı (¥)", value: "CNY", symbol: "¥" },
  { label: "Hindistan Rupisi (₹)", value: "INR", symbol: "₹" },
  { label: "Kanada Doları (C$)", value: "CAD", symbol: "C$" },
  { label: "Avustralya Doları (A$)", value: "AUD", symbol: "A$" },
] as const;

export const menuThemeOptions = [
  { label: "menu-1", value: "menu1" },
  { label: "menu-2", value: "menu2" },
  { label: "menu-3", value: "menu3" },
  { label: "menu-4", value: "menu4" },
  { label: "menu-5", value: "menu5" },
  { label: "menu-6", value: "menu6" },
] as const;

export function getMenuThemePreviewImage(theme: string): StaticImageData {
  switch (theme) {
    case "menu1":
      return assets.menuThemePreviews.cafemode;
    case "menu2":
      return assets.menuThemePreviews.classic;
    case "menu3":
      return assets.menuThemePreviews.minimal;
    case "menu4":
      return assets.menuThemePreviews.elegant;
    case "menu5":
      return assets.menuThemePreviews.urban;
    case "menu6":
      return assets.menuThemePreviews.cafemode;
    default:
      return assets.menuThemePreviews.cafemode;
  }
}

export type MenuCurrency = (typeof menuCurrencies)[number]["value"];
export type MenuTheme = (typeof menuThemeOptions)[number]["value"];

export function getCurrencyLabel(code: string) {
  return menuCurrencies.find((c) => c.value === code)?.label ?? code;
}

export function getThemeLabel(theme: string) {
  return menuThemeOptions.find((t) => t.value === theme)?.label ?? theme;
}

export function parseInstagramUsername(value?: string | null) {
  if (!value) return "";
  let username = value.trim();
  if (
    !username ||
    username === "null" ||
    username === "https://www.instagram.com/" ||
    username === "https://www.instagram.com/null"
  ) {
    return "";
  }
  if (username.startsWith("http")) {
    const match = username.match(/instagram\.com\/(.+)/);
    username = match ? match[1].replace(/\/$/, "") : "";
    if (username === "null") return "";
  }
  return username;
}
