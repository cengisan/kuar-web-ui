import type { StaticImageData } from "next/image";

import mobileHomepage from "@assets/slide/mobil/homepage.png";
import mobileDigitalMenu from "@assets/slide/mobil/digital-menu.png";
import mobileCreateMenu from "@assets/slide/mobil/create-menu.png";
import mobileTableArea from "@assets/slide/mobil/table-area.png";
import mobileTables from "@assets/slide/mobil/tables.png";
import mobileTableOrder from "@assets/slide/mobil/table-order.png";
import mobileKitchen from "@assets/slide/mobil/kitchen.png";
import mobileCashier from "@assets/slide/mobil/cashier.png";
import mobileOrderKitchenCashier from "@assets/slide/mobil/order-kitchen-cashier.png";
import mobileDashboard1 from "@assets/slide/mobil/dashboard-1.png";
import mobileDashboard2 from "@assets/slide/mobil/dashboard-2.png";
import mobileProducts from "@assets/slide/mobil/products.png";
import mobileStock1 from "@assets/slide/mobil/stock-1.png";
import mobileStock2 from "@assets/slide/mobil/stock-2.png";
import mobileEmployee from "@assets/slide/mobil/employee.png";
import mobileFeedback from "@assets/slide/mobil/feedback.png";
import mobileReservation from "@assets/slide/mobil/reservation.png";

import webCreateMenu from "@assets/slide/web/create-menu.png";
import webTableArea from "@assets/slide/web/table-area-web.png";
import webTables from "@assets/slide/web/tables-web.png";
import webTableOrder from "@assets/slide/web/table-order-web.png";
import webKitchen from "@assets/slide/web/kitchen-web.png";
import webCashier from "@assets/slide/web/cashier-web.png";
import webOrderKitchenCashier from "@assets/slide/web/order-kitchen-cashier-web.png";
import webDashboard1 from "@assets/slide/web/dashboard-web-1.png";
import webDashboard2 from "@assets/slide/web/dashboard-web-2.png";
import webProducts from "@assets/slide/web/products-web.png";
import webStock1 from "@assets/slide/web/stock-web-1.png";
import webEmployee from "@assets/slide/web/employee-web.png";
import webFeedback from "@assets/slide/web/feedback-web.png";

export type SlideAsset = {
  id: string;
  title: string;
  mobile?: StaticImageData;
  web?: StaticImageData;
  /** Wide composite mockups render full-width instead of web+mobile overlay */
  layout?: "dual" | "full";
};

export const slideAssets = {
  mobile: {
    homepage: mobileHomepage,
    digitalMenu: mobileDigitalMenu,
    createMenu: mobileCreateMenu,
    tableArea: mobileTableArea,
    tables: mobileTables,
    tableOrder: mobileTableOrder,
    kitchen: mobileKitchen,
    cashier: mobileCashier,
    orderKitchenCashier: mobileOrderKitchenCashier,
    dashboard1: mobileDashboard1,
    dashboard2: mobileDashboard2,
    products: mobileProducts,
    stock1: mobileStock1,
    stock2: mobileStock2,
    employee: mobileEmployee,
    feedback: mobileFeedback,
    reservation: mobileReservation,
  },
  web: {
    createMenu: webCreateMenu,
    tableArea: webTableArea,
    tables: webTables,
    tableOrder: webTableOrder,
    kitchen: webKitchen,
    cashier: webCashier,
    orderKitchenCashier: webOrderKitchenCashier,
    dashboard1: webDashboard1,
    dashboard2: webDashboard2,
    products: webProducts,
    stock1: webStock1,
    employee: webEmployee,
    feedback: webFeedback,
  },
} as const;

/** Curated pairs for the hero device showcase */
export const heroShowcaseSlides: SlideAsset[] = [
  {
    id: "overview",
    title: "Tek platform, tüm operasyon",
    mobile: slideAssets.mobile.homepage,
    web: slideAssets.web.dashboard1,
  },
  {
    id: "digital-menu",
    title: "Dijital menü",
    mobile: slideAssets.mobile.digitalMenu,
    web: slideAssets.web.createMenu,
  },
  {
    id: "tables",
    title: "Masa yönetimi",
    mobile: slideAssets.mobile.tables,
    web: slideAssets.web.tables,
  },
  {
    id: "operation-flow",
    title: "Sipariş → mutfak → kasa",
    mobile: slideAssets.mobile.orderKitchenCashier,
    layout: "full",
  },
  {
    id: "dashboard",
    title: "Dashboard & raporlar",
    mobile: slideAssets.mobile.dashboard1,
    web: slideAssets.web.dashboard2,
  },
  {
    id: "stock",
    title: "Stok takibi",
    mobile: slideAssets.mobile.stock1,
    web: slideAssets.web.stock1,
  },
];

/** Capability module previews — prefer web, fallback to mobile */
export const capabilitySlideMap: Record<string, SlideAsset> = {
  "digital-menu": {
    id: "digital-menu",
    title: "Dijital Menü",
    mobile: slideAssets.mobile.digitalMenu,
    web: slideAssets.web.createMenu,
  },
  "table-management": {
    id: "table-management",
    title: "Masa Yönetimi",
    mobile: slideAssets.mobile.tables,
    web: slideAssets.web.tables,
  },
  "kitchen-display": {
    id: "kitchen-display",
    title: "Mutfak Ekranı",
    mobile: slideAssets.mobile.kitchen,
    web: slideAssets.web.kitchen,
  },
  "cash-register": {
    id: "cash-register",
    title: "Kasa",
    mobile: slideAssets.mobile.cashier,
    web: slideAssets.web.cashier,
  },
  "stock-management": {
    id: "stock-management",
    title: "Stok Takibi",
    mobile: slideAssets.mobile.stock1,
    web: slideAssets.web.stock1,
  },
  dashboard: {
    id: "dashboard",
    title: "Dashboard",
    mobile: slideAssets.mobile.dashboard2,
    web: slideAssets.web.dashboard1,
  },
};

/** Full platform gallery for the cross-platform section */
export const platformGallerySlides: SlideAsset[] = [
  {
    id: "create-menu",
    title: "Menü oluşturma",
    mobile: slideAssets.mobile.createMenu,
    web: slideAssets.web.createMenu,
  },
  {
    id: "table-area",
    title: "Alan yönetimi",
    mobile: slideAssets.mobile.tableArea,
    web: slideAssets.web.tableArea,
  },
  {
    id: "table-order",
    title: "Masa siparişi",
    mobile: slideAssets.mobile.tableOrder,
    web: slideAssets.web.tableOrder,
  },
  {
    id: "operation-flow",
    title: "Sipariş → mutfak → kasa",
    mobile: slideAssets.mobile.orderKitchenCashier,
    web: slideAssets.web.orderKitchenCashier,
  },
  {
    id: "products",
    title: "Ürün yönetimi",
    mobile: slideAssets.mobile.products,
    web: slideAssets.web.products,
  },
  {
    id: "employees",
    title: "Çalışan yönetimi",
    mobile: slideAssets.mobile.employee,
    web: slideAssets.web.employee,
  },
  {
    id: "feedback",
    title: "Geri bildirim",
    mobile: slideAssets.mobile.feedback,
    web: slideAssets.web.feedback,
  },
];

export function pickSlideImage(slide: SlideAsset, platform: "web" | "mobile" = "web"): StaticImageData {
  if (platform === "web" && slide.web) return slide.web;
  if (platform === "mobile" && slide.mobile) return slide.mobile;
  return slide.web ?? slide.mobile!;
}
