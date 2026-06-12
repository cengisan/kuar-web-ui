"use client";

import Link from "next/link";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/marketing/Logo";
import { useAppDispatch, useAppSelector } from "@/presentation/state/hooks";
import { setLanguage } from "@/presentation/state/userSlice";
import { useTranslation } from "@/hooks/useTranslation";

export function PublicHeader() {
  const dispatch = useAppDispatch();
  const { language } = useAppSelector((s) => s.user);
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-[#111111]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo href="/" size="lg" />

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden text-muted-foreground sm:inline-flex">
            <Link href="/features">{t("footerFeaturesNav")}</Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(setLanguage(language === "en" ? "tr" : "en"))}
            className="text-muted-foreground"
          >
            <Globe className="mr-1 h-4 w-4" />
            {language.toUpperCase()}
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/register">{t("register")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
