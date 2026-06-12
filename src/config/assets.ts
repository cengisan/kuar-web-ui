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
