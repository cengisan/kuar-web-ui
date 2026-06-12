import logoDark from "@assets/images/logo.png";
import logoLight from "@assets/images/logo-light.png";
import googleIcon from "@assets/images/google.png";
import visa from "@assets/brands/visa.png";
import mastercard from "@assets/brands/mastercard.png";
import troy from "@assets/brands/troy.png";
import amex from "@assets/brands/amex.png";
import paymentSuccessGif from "@assets/gif/PaymentSuccess.gif";
import successfulGif from "@assets/gif/Successful.gif";
import menuThemeCafemode from "@assets/previewImages/cafemode.png";
import menuThemeClassic from "@assets/previewImages/classic.png";
import menuThemeMinimal from "@assets/previewImages/minimal.png";
import menuThemeElegant from "@assets/previewImages/elegant.png";
import menuThemeUrban from "@assets/previewImages/urban.png";
import slideCashier from "@assets/slide/cashier.jpeg";
import slideCreateMenu from "@assets/slide/create-menu.jpeg";
import slideDashboard1 from "@assets/slide/dashboard-1.jpeg";
import slideDashboard2 from "@assets/slide/dashboard-2.jpeg";
import slideDigitalMenu from "@assets/slide/digital-menu.jpeg";
import slideEmployees from "@assets/slide/employees.jpeg";
import slideFeedback from "@assets/slide/feedback.jpeg";
import slideHomepage from "@assets/slide/homepage.jpeg";
import slideKitchen from "@assets/slide/kitchen.jpeg";
import slideProducts from "@assets/slide/products.jpeg";
import slideReservation from "@assets/slide/reservation.jpeg";
import slideStock1 from "@assets/slide/stock-1.jpeg";
import slideStock2 from "@assets/slide/stock-2.jpeg";
import slideTableArea from "@assets/slide/table-area.jpeg";
import slideTableOrder from "@assets/slide/table-order.jpeg";
import slideTables from "@assets/slide/tables.jpeg";

export const heroSlides = [
  { src: slideHomepage, alt: "Kuar ana sayfa" },
  { src: slideDigitalMenu, alt: "Dijital menü" },
  { src: slideCreateMenu, alt: "Menü oluşturma" },
  { src: slideTableArea, alt: "Masa alanları" },
  { src: slideTables, alt: "Masa yönetimi" },
  { src: slideTableOrder, alt: "Masa siparişi" },
  { src: slideKitchen, alt: "Mutfak ekranı" },
  { src: slideCashier, alt: "Kasa" },
  { src: slideDashboard1, alt: "Dashboard" },
  { src: slideDashboard2, alt: "Dashboard raporları" },
  { src: slideProducts, alt: "Ürün yönetimi" },
  { src: slideStock1, alt: "Stok takibi" },
  { src: slideStock2, alt: "Stok hareketleri" },
  { src: slideEmployees, alt: "Çalışan yönetimi" },
  { src: slideFeedback, alt: "Geri bildirim" },
  { src: slideReservation, alt: "Rezervasyon" },
] as const;

export const assets = {
  logo: {
    dark: logoDark,
    light: logoLight,
  },
  google: googleIcon,
  brands: {
    visa,
    mastercard,
    troy,
    amex,
  },
  gif: {
    paymentSuccess: paymentSuccessGif,
    successful: successfulGif,
  },
  menuThemePreviews: {
    cafemode: menuThemeCafemode,
    classic: menuThemeClassic,
    minimal: menuThemeMinimal,
    elegant: menuThemeElegant,
    urban: menuThemeUrban,
  },
} as const;

export type StaticImage = (typeof assets.logo.dark);
