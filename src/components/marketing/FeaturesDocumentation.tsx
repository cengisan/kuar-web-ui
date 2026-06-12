"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Lightbulb, ListOrdered } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import {
  gettingStartedSteps,
  moduleGuides,
  getLocalizedText,
} from "@/config/moduleGuides";
import { useTranslation } from "@/hooks/useTranslation";

export function FeaturesDocumentation() {
  const { t, language } = useTranslation();
  const lang = language === "en" ? "en" : "tr";
  const [activeId, setActiveId] = useState(moduleGuides[0]?.id ?? "");
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  const registerSection = useCallback((id: string, node: HTMLElement | null) => {
    if (node) {
      sectionRefs.current.set(id, node);
    } else {
      sectionRefs.current.delete(id);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5] },
    );

    sectionRefs.current.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const node = sectionRefs.current.get(id);
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="border-b border-border py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{t("featuresPageTitle")}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("featuresPageSubtitle")}</p>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground md:text-base">
            {t("featuresPageIntro")}
          </p>
        </div>
      </section>

      {/* Getting started */}
      <section className="border-b border-border py-12 md:py-16">
        <h2 className="text-2xl font-bold">{t("featuresGettingStartedTitle")}</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-2">
          {gettingStartedSteps.map((step, index) => (
            <li
              key={step.title.en}
              className="flex gap-4 rounded-2xl border border-border bg-card p-5"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-semibold">{getLocalizedText(step.title, lang)}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {getLocalizedText(step.description, lang)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Mobile chip nav */}
      <div className="sticky top-16 z-30 border-b border-border bg-[#111111]/95 py-3 backdrop-blur lg:hidden">
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {moduleGuides.map((guide) => (
            <button
              key={guide.id}
              type="button"
              onClick={() => scrollToSection(guide.id)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                activeId === guide.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {t(guide.titleKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-10 py-12 lg:grid-cols-[240px_1fr] lg:gap-16 lg:py-16">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <nav className="sticky top-24">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("featuresModuleListTitle")}
            </p>
            <ul className="mt-4 space-y-1">
              {moduleGuides.map((guide) => (
                <li key={guide.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(guide.id)}
                    className={cn(
                      "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      activeId === guide.id
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {t(guide.titleKey)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Module sections */}
        <div className="space-y-12">
          {moduleGuides.map((guide) => {
            const Icon = guide.icon;
            return (
              <article
                key={guide.id}
                id={guide.id}
                ref={(node) => registerSection(guide.id, node)}
                className="scroll-mt-28 rounded-2xl border border-border bg-card shadow-sm"
              >
                <div
                  className={cn(
                    "relative overflow-hidden rounded-t-2xl border-b border-border p-6 md:p-8",
                    `bg-gradient-to-br ${guide.accent}`,
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex size-12 shrink-0 items-center justify-center rounded-xl bg-background/80",
                        guide.iconColor,
                      )}
                    >
                      <Icon className="size-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold md:text-2xl">{t(guide.titleKey)}</h2>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                        {t(guide.descKey)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 p-6 md:p-8">
                  {guide.prerequisites && (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-400">
                        {t("featuresPrerequisites")}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {getLocalizedText(guide.prerequisites, lang)}
                      </p>
                    </div>
                  )}

                  <div>
                    <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                      <ListOrdered className="size-4 text-primary" />
                      {t("featuresViewSteps")}
                    </div>
                    <ol className="space-y-4">
                      {guide.steps.map((step, index) => (
                        <li key={step.title.en} className="flex gap-4">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-bold text-primary">
                            {index + 1}
                          </span>
                          <div>
                            <h3 className="font-medium">{getLocalizedText(step.title, lang)}</h3>
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                              {getLocalizedText(step.description, lang)}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {guide.tips && guide.tips.length > 0 && (
                    <div className="rounded-xl border border-border bg-muted/30 p-4">
                      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <Lightbulb className="size-3.5" />
                        {t("featuresTips")}
                      </p>
                      <ul className="mt-3 space-y-2">
                        {guide.tips.map((tip) => (
                          <li key={tip.en} className="text-sm text-muted-foreground">
                            • {getLocalizedText(tip, lang)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <section className="mb-16 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-10 text-center md:p-14">
        <h2 className="text-2xl font-bold md:text-3xl">{t("featuresCtaTitle")}</h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">{t("featuresCtaSubtitle")}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="shadow-glow">
            <Link href="/register">
              {t("register")}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">{t("signIn")}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
