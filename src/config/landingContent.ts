import type { LucideIcon } from "lucide-react";
import {
  UtensilsCrossed,
  LayoutGrid,
  ChefHat,
  CreditCard,
  Package,
  BarChart3,
} from "lucide-react";

export type LandingCapability = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  slide?: string;
};

export const landingCapabilities: LandingCapability[] = [
  {
    id: "digital-menu",
    icon: UtensilsCrossed,
    title: "Dijital Menü",
    description:
      "QR kod ile menünüzü anında güncelleyin. Temalar, kategoriler ve ürün görselleri tek ekrandan yönetilsin.",
    slide: "/slides/digital-menu.jpeg",
  },
  {
    id: "table-management",
    icon: LayoutGrid,
    title: "Masa Yönetimi",
    description:
      "Alanlar, masalar ve sipariş durumlarını canlı takip edin. Servis ekibi her masayı tek bakışta görsün.",
    slide: "/slides/tables.jpeg",
  },
  {
    id: "kitchen-display",
    icon: ChefHat,
    title: "Mutfak Ekranı",
    description:
      "Siparişler mutfağa anında düşsün. Hazırlık sürecini ekrandan yönetin, gecikmeleri azaltın.",
    slide: "/slides/kitchen.jpeg",
  },
  {
    id: "cash-register",
    icon: CreditCard,
    title: "Kasa",
    description:
      "Ödeme alın, adisyon kapatın ve günlük ciroyu gerçek zamanlı izleyin. Tüm kasa akışı tek yerde.",
    slide: "/slides/cashier.jpeg",
  },
  {
    id: "stock-management",
    icon: Package,
    title: "Stok Takibi",
    description:
      "Malzeme stoklarını yönetin, hareketleri kaydedin ve düşük stok uyarılarıyla sürprizleri önleyin.",
    slide: "/slides/stock-1.jpeg",
  },
  {
    id: "dashboard",
    icon: BarChart3,
    title: "Dashboard",
    description:
      "Satış raporları, ürün performansı ve ödeme dağılımını analiz ederek işletmenizi büyütün.",
    slide: "/slides/dashboard-1.jpeg",
  },
];

export const heroRotatingWords = ["restoranlar", "kafeler", "işletmeler"];

export const operationsStack = [
  { label: "Menü", detail: "Dijital menü & ürünler" },
  { label: "Sipariş", detail: "Masa & adisyon akışı" },
  { label: "Mutfak", detail: "Canlı sipariş ekranı" },
  { label: "Kasa", detail: "Ödeme & kapanış" },
  { label: "Rapor", detail: "Dashboard & analiz" },
];

export const landingStats = [
  { value: "7/24", label: "Canlı operasyon" },
  { value: "1", label: "Platform, tüm modüller" },
  { value: "∞", label: "Ürün & menü kapasitesi" },
];

export const landingSteps = [
  { step: "01", title: "Kayıt ol", desc: "Dakikalar içinde hesabınızı oluşturun." },
  { step: "02", title: "İşletmenizi ekleyin", desc: "Menü, ürün ve masalarınızı tanımlayın." },
  { step: "03", title: "Yönetmeye başlayın", desc: "Sipariş, mutfak ve kasa akışını tek yerden yönetin." },
];
