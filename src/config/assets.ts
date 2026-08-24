import logoDark from "@assets/images/logo.png";
import logoLight from "@assets/images/logo-light.png";
import googleIcon from "@assets/images/google.png";
import visa from "@assets/brands/visa.png";
import mastercard from "@assets/brands/mastercard.png";
import troy from "@assets/brands/troy.png";
import amex from "@assets/brands/amex.png";
import paymentSuccessGif from "@assets/gif/PaymentSuccess.gif";
import successfulGif from "@assets/gif/Successful.gif";
import menuTheme1Preview from "@assets/previewImages/menu-1.jpeg";
import menuTheme2Preview from "@assets/previewImages/menu-2.jpeg";
import menuTheme3Preview from "@assets/previewImages/menu-3.jpeg";
import menuTheme4Preview from "@assets/previewImages/menu-4.jpeg";
import menuTheme5Preview from "@assets/previewImages/menu-5.jpeg";
import menuTheme6Preview from "@assets/previewImages/menu-6.jpeg";

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
    menu1: menuTheme1Preview,
    menu2: menuTheme2Preview,
    menu3: menuTheme3Preview,
    menu4: menuTheme4Preview,
    menu5: menuTheme5Preview,
    menu6: menuTheme6Preview,
  },
} as const;

export type StaticImage = (typeof assets.logo.dark);
