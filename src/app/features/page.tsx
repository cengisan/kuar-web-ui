import type { Metadata } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Footer } from "@/components/layout/Footer";
import { FeaturesDocumentation } from "@/components/marketing/FeaturesDocumentation";

export const metadata: Metadata = {
  title: "Özellikler",
  description:
    "Kuar modüllerinin adım adım kullanım kılavuzu: dijital menü, masa yönetimi, mutfak ekranı, kasa, stok, dashboard ve daha fazlası.",
  openGraph: {
    title: "Özellikler | Kuar",
    description:
      "Restoran ve kafe işletmeleri için modüler yönetim platformu — tüm modüllerin kullanım rehberi.",
  },
};

export default function FeaturesPage() {
  return (
    <>
      <PublicHeader />
      <main className="flex-1">
        <FeaturesDocumentation />
      </main>
      <Footer />
    </>
  );
}
