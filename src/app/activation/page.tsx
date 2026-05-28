"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { ActivationForm } from "@/components/auth/ActivationForm";

function ActivationContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  if (!email) {
    return <p className="text-destructive">Email parameter required.</p>;
  }

  return <ActivationForm email={email} />;
}

export default function ActivationPage() {
  return (
    <>
      <PublicHeader />
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col items-center justify-center px-6 py-12">
        <h1 className="mb-8 text-2xl font-bold">E-posta Doğrulama</h1>
        <Suspense fallback={<p>Yükleniyor...</p>}>
          <ActivationContent />
        </Suspense>
        <p className="mt-6 text-sm text-muted-foreground">
          <Link href="/login" className="hover:underline">
            ← Giriş sayfasına dön
          </Link>
        </p>
      </div>
    </>
  );
}
