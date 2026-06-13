import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { LegalDocument } from "@/components/marketing/LegalDocument";

export const metadata: Metadata = {
  title: "Kullanım Şartları",
  description:
    "Kuar restoran yönetim platformu kullanım şartları: deneme süresi, abonelik, ödeme ve kullanım kuralları.",
  openGraph: {
    title: "Kullanım Şartları | Kuar",
    description: "Kuar hizmetinin kullanımına ilişkin şartlar ve koşullar.",
  },
};

export default function TermsPage() {
  return (
    <>
      <PublicHeader />
      <main className="flex-1">
        <LegalDocument type="terms" />
      </main>
      <Footer />
    </>
  );
}
