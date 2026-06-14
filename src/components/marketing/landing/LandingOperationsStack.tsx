"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { operationsStack } from "@/config/landingContent";
import { slideAssets } from "@/config/slideAssets";
import { SLIDE_SIZES } from "@/config/slideImageConfig";
import { SlideImage } from "@/components/marketing/mockups/SlideImage";

const flowHighlights = [
  { label: "Sipariş", detail: "Masadan anında kayıt" },
  { label: "Mutfak", detail: "Canlı hazırlık ekranı" },
  { label: "Kasa", detail: "Ödeme & adisyon kapanışı" },
];

export function LandingOperationsStack() {
  return (
    <section className="landing-section overflow-hidden bg-muted/20">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="max-w-3xl">
          <p className="landing-eyebrow">Operasyon katmanı</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            Siparişten kasaya kesintisiz akış
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Servis ekibi siparişi girer, mutfak anında görür, kasa tek dokunuşla kapanır.
            Üç adım, tek platform — arada veri kaybı yok.
          </p>
        </div>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14 xl:gap-16">
          <div className="space-y-4">
            {flowHighlights.map((step, index) => (
              <div
                key={step.label}
                className="flex items-center gap-5 rounded-2xl border border-border/60 bg-card/60 px-5 py-5 backdrop-blur-sm"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-sm font-semibold text-primary">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold">{step.label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
                </div>
                {index < flowHighlights.length - 1 && (
                  <ArrowRight className="hidden size-5 shrink-0 text-primary/40 sm:block" />
                )}
              </div>
            ))}
          </div>

          <div className="relative min-w-0 w-full lg:max-w-[620px] lg:justify-self-end xl:max-w-[680px]">
            <div
              className="pointer-events-none absolute -inset-10 rounded-[2rem] bg-gradient-to-br from-primary/15 via-transparent to-accent/10 blur-3xl slide-glow-pulse"
              aria-hidden
            />
            <div className="relative slide-preview-enter">
              <SlideImage
                src={slideAssets.mobile.orderKitchenCashier}
                alt="Sipariş, mutfak ve kasa ekranları — tek akışta"
                priority
                sizes={SLIDE_SIZES.operations}
              />
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-border/50 pt-14">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Tüm operasyon hattı
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
            {operationsStack.map((step, index) => (
              <div key={step.label} className="relative">
                <div
                  className={cn(
                    "landing-stack-card flex h-full flex-col rounded-2xl border p-5 backdrop-blur-sm sm:p-6",
                    index >= 1 && index <= 3
                      ? "border-primary/25 bg-primary/5"
                      : "border-border/70 bg-card/80",
                  )}
                >
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-base font-semibold">{step.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
                </div>
                {index < operationsStack.length - 1 && (
                  <ArrowRight
                    className="absolute -right-3 top-1/2 hidden size-4 -translate-y-1/2 text-primary/30 lg:block"
                    aria-hidden
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
