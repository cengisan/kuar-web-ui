"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  heroShowcaseSlides,
  pickSlideImage,
} from "@/config/slideAssets";
import { MockupCrossfade } from "./DeviceFrame";

const SLIDE_INTERVAL_MS = 8000;

export function HeroDeviceShowcase({ className }: { className?: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const activeSlide = heroShowcaseSlides[activeIndex];

  const webSlides = useMemo(
    () =>
      heroShowcaseSlides.map((slide) => ({
        src: pickSlideImage(slide, "web"),
        alt: `${slide.title} — web`,
      })),
    [],
  );

  const mobileSlides = useMemo(
    () =>
      heroShowcaseSlides.map((slide) => ({
        src: pickSlideImage(slide, "mobile"),
        alt: `${slide.title} — mobil`,
      })),
    [],
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const goTo = useCallback((index: number) => {
    const next = (index + heroShowcaseSlides.length) % heroShowcaseSlides.length;
    setActiveIndex(next);
    setProgressKey((key) => key + 1);
  }, []);

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (reduceMotion || heroShowcaseSlides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroShowcaseSlides.length);
      setProgressKey((key) => key + 1);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <div className={cn("group relative w-full", className)}>
      <div
        className="pointer-events-none absolute -right-10 top-1/4 size-64 rounded-full bg-primary/15 blur-3xl mockup-glow-pulse"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-8 bottom-1/4 size-48 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[640px] lg:max-w-none">
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/11]">
          <div className="absolute inset-x-0 top-0 z-10 px-1 sm:px-0">
            <MockupCrossfade
              slides={webSlides}
              activeIndex={activeIndex}
              platform="web"
              priorityFirst
            />
          </div>

          <div className="absolute -bottom-2 right-0 z-20 w-[34%] min-w-[108px] max-w-[168px] sm:-bottom-4 sm:right-2 sm:w-[30%] sm:max-w-[190px] lg:-right-6 lg:max-w-[210px] mockup-float">
            <MockupCrossfade
              slides={mobileSlides}
              activeIndex={activeIndex}
              platform="mobile"
              priorityFirst
            />
          </div>
        </div>

        <button
          type="button"
          onClick={goPrev}
          aria-label="Önceki ekran"
          className="absolute left-0 top-[38%] z-30 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-background/75 text-foreground opacity-0 backdrop-blur-md transition-all hover:border-primary/40 hover:bg-background/90 group-hover:opacity-100 sm:-left-3"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Sonraki ekran"
          className="absolute right-0 top-[38%] z-30 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-background/75 text-foreground opacity-0 backdrop-blur-md transition-all hover:border-primary/40 hover:bg-background/90 group-hover:opacity-100 sm:-right-3"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="mt-6 px-1">
        <div className="mb-3 h-1 overflow-hidden rounded-full bg-muted/50">
          <div
            key={progressKey}
            className={cn(
              "h-full rounded-full bg-gradient-to-r from-primary to-accent",
              reduceMotion ? "w-full" : "hero-slide-progress",
            )}
            style={
              reduceMotion
                ? undefined
                : ({ "--slide-duration": `${SLIDE_INTERVAL_MS}ms` } as React.CSSProperties)
            }
          />
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground">{activeSlide.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Web paneli & mobil uygulama</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1.5 sm:flex">
              {heroShowcaseSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={slide.title}
                  onClick={() => goTo(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    index === activeIndex
                      ? "w-6 bg-primary"
                      : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50",
                  )}
                />
              ))}
            </div>
            <p className="shrink-0 text-xs tabular-nums text-muted-foreground">
              {activeIndex + 1}/{heroShowcaseSlides.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
