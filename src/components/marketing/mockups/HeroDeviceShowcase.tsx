"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { heroShowcaseSlides, pickSlideImage } from "@/config/slideAssets";
import { SLIDE_SIZES } from "@/config/slideImageConfig";
import {
  heroMobileCornerClassName,
  heroShowcaseClassName,
} from "@/config/marketingShowcaseLayout";
import { SlideCrossfade } from "./SlideImage";

const SLIDE_INTERVAL_MS = 8000;

export function HeroDeviceShowcase({ className }: { className?: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  const activeSlide = heroShowcaseSlides[activeIndex];
  const isFullLayout = activeSlide.layout === "full";

  const mainSlides = useMemo(
    () =>
      heroShowcaseSlides.map((slide) => ({
        src:
          slide.layout === "full" && slide.mobile
            ? slide.mobile
            : pickSlideImage(slide, "web"),
        alt: slide.title,
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
  }, []);

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (reduceMotion || heroShowcaseSlides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroShowcaseSlides.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <div className={cn("group relative w-full overflow-visible", className)}>
      <div
        className="pointer-events-none absolute -right-10 top-1/4 size-64 rounded-full bg-primary/15 blur-3xl slide-glow-pulse"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-8 bottom-1/4 size-48 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />

      <div className="relative w-full min-w-0">
        <div className={heroShowcaseClassName}>
          <SlideCrossfade
            slides={mainSlides}
            activeIndex={activeIndex}
            priorityFirst
            sizes={SLIDE_SIZES.heroMain}
          />

          {!isFullLayout && (
            <div className={heroMobileCornerClassName}>
              <SlideCrossfade
                slides={mobileSlides}
                activeIndex={activeIndex}
                sizes={SLIDE_SIZES.heroMobile}
              />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={goPrev}
          aria-label="Önceki ekran"
          className="absolute left-0 top-1/2 z-30 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-background/75 text-foreground opacity-0 backdrop-blur-md transition-all hover:border-primary/40 hover:bg-background/90 group-hover:opacity-100 sm:-left-3"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Sonraki ekran"
          className="absolute right-0 top-1/2 z-30 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-background/75 text-foreground opacity-0 backdrop-blur-md transition-all hover:border-primary/40 hover:bg-background/90 group-hover:opacity-100 sm:-right-3"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="relative z-30 mt-6 px-1">
        <p className="text-sm font-semibold text-foreground">Tek platform, tüm operasyon</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Web paneli & mobil uygulama</p>
      </div>
    </div>
  );
}
