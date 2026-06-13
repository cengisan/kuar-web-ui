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
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-14 xl:gap-16">
          <div>
            <p className="landing-eyebrow">Operasyon katmanı</p>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              Siparişten kasaya kesintisiz akış
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Servis ekibi siparişi girer, mutfak anında görür, kasa tek dokunuşla kapanır.
              Üç adım, tek platform — arada veri kaybı yok.
            </p>

            <div className="mt-8 space-y-3">
              {flowHighlights.map((step, index) => (
                <div
                  key={step.label}
                  className="flex items-center gap-4 rounded-xl border border-border/60 bg-card/60 px-4 py-3 backdrop-blur-sm"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{step.label}</p>
                    <p className="text-xs text-muted-foreground">{step.detail}</p>
                  </div>
                  {index < flowHighlights.length - 1 && (
                    <ArrowRight className="ml-auto hidden size-4 shrink-0 text-primary/50 sm:block" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 overflow-x-auto pb-2">
              <div className="flex min-w-max items-stretch gap-3 md:min-w-0 md:grid md:grid-cols-5 md:gap-3">
                {operationsStack.map((step, index) => (
                  <div key={step.label} className="relative flex w-36 flex-col md:w-auto">
                    <div
                      className={cn(
                        "landing-stack-card flex h-full flex-col rounded-xl border p-4 backdrop-blur-sm",
                        index >= 1 && index <= 3
                          ? "border-primary/25 bg-primary/5"
                          : "border-border/70 bg-card/80",
                      )}
                    >
                      <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-primary">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-2 text-sm font-semibold">{step.label}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
            <div
              className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-gradient-to-br from-primary/15 via-transparent to-accent/10 blur-3xl slide-glow-pulse"
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
      </div>
    </section>
  );
}
