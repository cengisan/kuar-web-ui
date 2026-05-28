import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import { assets } from "@/config/assets";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Kuar - Restoran Yönetim Platformu",
    template: "%s | Kuar",
  },
  description:
    "Dijital menü, masa yönetimi, mutfak ekranı, kasa ve stok takibi — tek platformda restoranınızı yönetin.",
  openGraph: {
    title: "Kuar - Restoran Yönetim Platformu",
    description: "Restoran ve kafe işletmeleri için modern yönetim platformu",
    type: "website",
    images: [
      {
        url: assets.logo.dark.src,
        width: assets.logo.dark.width,
        height: assets.logo.dark.height,
      },
    ],
  },
  icons: {
    icon: assets.logo.dark.src,
    apple: assets.logo.dark.src,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("@theme_preference");if(t==="light")document.documentElement.classList.add("light");}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
