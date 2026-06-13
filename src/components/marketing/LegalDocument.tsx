"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { getLocalizedText } from "@/config/moduleGuides";
import {
  LEGAL_META,
  privacySections,
  termsSections,
  type LegalSection,
} from "@/config/legalContent";
import { useTranslation } from "@/hooks/useTranslation";

type LegalDocumentType = "terms" | "privacy";

const documentSections: Record<LegalDocumentType, LegalSection[]> = {
  terms: termsSections,
  privacy: privacySections,
};

export function LegalDocument({ type }: { type: LegalDocumentType }) {
  const { t, language } = useTranslation();
  const lang = language === "en" ? "en" : "tr";
  const sections = documentSections[type];
  const title = type === "terms" ? t("termsPageTitle") : t("privacyPageTitle");
  const subtitle = type === "terms" ? t("termsPageSubtitle") : t("privacyPageSubtitle");
  const siblingHref = type === "terms" ? "/privacy" : "/terms";
  const siblingLabel = type === "terms" ? t("footerPrivacy") : t("footerTerms");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="border-b border-border pb-10">
        <p className="text-sm font-medium text-primary">{LEGAL_META.companyName}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        <p className="mt-3 text-muted-foreground">{subtitle}</p>
        <p className="mt-4 text-sm text-muted-foreground">
          {t("legalLastUpdated")}: {getLocalizedText(LEGAL_META.lastUpdated, lang)}
        </p>
      </header>

      <div className="mt-8 flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
        <p>{t("legalDraftDisclaimer")}</p>
      </div>

      <article className="prose-legal mt-10 space-y-10">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight">{getLocalizedText(section.title, lang)}</h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph[lang]}>{getLocalizedText(paragraph, lang)}</p>
              ))}
              {section.listItems && (
                <ul className="list-disc space-y-2 pl-5">
                  {section.listItems.map((item) => (
                    <li key={item[lang]}>{getLocalizedText(item, lang)}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}
      </article>

      <footer className="mt-12 flex flex-col gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          {t("legalContactLabel")}:{" "}
          <a href={`mailto:${LEGAL_META.contactEmail}`} className="text-foreground hover:underline">
            {LEGAL_META.contactEmail}
          </a>
        </p>
        <Link href={siblingHref} className="font-medium text-primary hover:underline">
          {siblingLabel} →
        </Link>
      </footer>
    </div>
  );
}
