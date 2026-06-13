import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { LegalDocument } from "@/components/marketing/LegalDocument";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description:
    "Kuar gizlilik politikası ve KVKK kapsamında kişisel verilerin işlenmesine ilişkin bilgilendirme metni.",
  openGraph: {
    title: "Gizlilik Politikası | Kuar",
    description: "Kuar'da kişisel verilerinizin nasıl işlendiğine dair bilgilendirme.",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <PublicHeader />
      <main className="flex-1">
        <LegalDocument type="privacy" />
      </main>
      <Footer />
    </>
  );
}
