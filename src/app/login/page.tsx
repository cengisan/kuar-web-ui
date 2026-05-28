import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { LoginPageClient } from "@/components/auth/LoginPageClient";
import { AuthLayout } from "@/components/marketing/AuthLayout";

export default function LoginPage() {
  return (
    <>
      <PublicHeader />
      <AuthLayout title="Tekrar hoş geldiniz" subtitle="Hesabınıza giriş yapın">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
          <LoginPageClient />
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="font-medium text-primary hover:underline">
            ← Ana sayfaya dön
          </Link>
        </p>
      </AuthLayout>
    </>
  );
}
