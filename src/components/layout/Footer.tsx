"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/cn";
import { Logo } from "@/components/marketing/Logo";
import { useTranslation } from "@/hooks/useTranslation";

export interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className={cn("w-full border-t border-border bg-muted/20", className)}>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo href="/" size="md" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t("footerTagline")}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold">{t("footerProduct")}</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/features" className="transition-colors hover:text-foreground">
                  {t("footerFeatures")}
                </Link>
              </li>
              <li>
                <Link href="/register" className="transition-colors hover:text-foreground">
                  {t("register")}
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition-colors hover:text-foreground">
                  {t("signIn")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">{t("footerLegal")}</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="transition-colors hover:text-foreground">
                  {t("footerPrivacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-foreground">
                  {t("footerTerms")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-foreground">
                  {t("footerContact")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {year} Kuar. {t("footerCopyright")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("footerMadeWith")} ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
