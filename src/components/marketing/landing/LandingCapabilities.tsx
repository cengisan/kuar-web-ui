"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { landingCapabilities } from "@/config/landingContent";
import { capabilitySlideMap, pickSlideImage } from "@/config/slideAssets";
import { SLIDE_SIZES } from "@/config/slideImageConfig";
import { SlideImage } from "@/components/marketing/mockups/SlideImage";

export function LandingCapabilities() {
  const [activeId, setActiveId] = useState(landingCapabilities[0].id);
  const active =
    landingCapabilities.find((item) => item.id === activeId) ?? landingCapabilities[0];
  const activeSlide = capabilitySlideMap[active.id];

  return (
    <section className="landing-section border-t border-border/60">
      <div className="mx-auto max-w-[1400px] px-6">
        <p className="landing-eyebrow">Güvenebileceğiniz modüller</p>
        <div className="mt-4 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            İşletmeniz için ihtiyacınız olan her şey, tek platformda
          </h2>
          <Link
            href="/features"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-accent"
          >
            Tüm modülleri incele
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-start lg:gap-8 xl:gap-10">
          <div className="space-y-2">
            {landingCapabilities.map((capability) => {
              const isActive = capability.id === activeId;
              const Icon = capability.icon;

              return (
                <button
                  key={capability.id}
                  type="button"
                  onClick={() => setActiveId(capability.id)}
                  className={cn(
                    "group w-full rounded-2xl border px-5 py-4 text-left transition-all duration-300",
                    isActive
                      ? "border-primary/30 bg-primary/5 shadow-[0_0_0_1px_rgba(34,197,94,0.08)]"
                      : "border-transparent bg-transparent hover:border-border hover:bg-muted/30",
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                        isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">{capability.title}</h3>
                      <p
                        className={cn(
                          "mt-1 text-sm leading-relaxed transition-colors",
                          isActive ? "text-muted-foreground" : "text-muted-foreground/80",
                        )}
                      >
                        {capability.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {activeSlide && (
            <div className="relative flex min-w-0 flex-col lg:sticky lg:top-24">
              <div
                className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-primary/10 via-transparent to-accent/10 blur-2xl slide-glow-pulse"
                aria-hidden
              />

              <div key={active.id} className="relative slide-preview-enter">
                <div className="mb-3 flex items-center justify-between px-1">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    {active.title}
                  </p>
                  <p className="text-xs text-muted-foreground">Web & mobil</p>
                </div>

                <div className="relative w-full overflow-visible">
                  <SlideImage
                    src={pickSlideImage(activeSlide, "web")}
                    alt={`${active.title} — web paneli`}
                    priority
                    sizes={SLIDE_SIZES.capabilityMain}
                  />

                  {activeSlide.mobile && (
                    <div className="absolute right-0 bottom-[5%] z-10 w-[58%] min-w-[170px] max-w-[360px] sm:min-w-[210px] sm:max-w-[440px] lg:-right-8 lg:bottom-[3%] lg:w-[52%] lg:min-w-[280px] lg:max-w-[560px] xl:max-w-[620px] slide-float-delayed">
                      <SlideImage
                        src={pickSlideImage(activeSlide, "mobile")}
                        alt={`${active.title} — mobil uygulama`}
                        sizes={SLIDE_SIZES.capabilityMobile}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
