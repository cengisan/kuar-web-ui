import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { RegisterPageClient } from "@/components/auth/RegisterPageClient";
import { AuthLayout } from "@/components/marketing/AuthLayout";

export default function RegisterPage() {
  return (
    <>
      <PublicHeader />
      <AuthLayout title="Hesap oluşturun" subtitle="Ücretsiz kayıt olun ve hemen başlayın">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
          <RegisterPageClient />
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Zaten hesabınız var mı?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Giriş yapın
          </Link>
        </p>
      </AuthLayout>
    </>
  );
}
