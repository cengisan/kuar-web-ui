"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";

export function NotFoundContent() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div>
        <p className="text-7xl font-bold text-primary">404</p>
        <h1 className="mt-4 text-2xl font-semibold">{t("pageNotFound")}</h1>
        <p className="mt-2 max-w-md text-muted-foreground">{t("pageNotFoundDescription")}</p>
      </div>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">{t("homePage")}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard">{t("goToDashboard")}</Link>
        </Button>
      </div>
    </div>
  );
}
