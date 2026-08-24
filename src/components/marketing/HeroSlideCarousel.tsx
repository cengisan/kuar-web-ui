"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { heroSlides } from "@/config/heroSlides";

const SLIDE_INTERVAL_MS = 10000;

export function HeroSlideCarousel({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "minimal";
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const isMinimal = variant === "minimal";

  const activeSlide = heroSlides[activeIndex];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const goTo = useCallback((index: number) => {
    const next = (index + heroSlides.length) % heroSlides.length;
    setActiveIndex(next);
    setProgressKey((key) => key + 1);
  }, []);

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (reduceMotion || heroSlides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
      setProgressKey((key) => key + 1);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  const controls = (
    <div className={cn("mt-5", isMinimal ? "px-0" : "px-4 py-3 border-t border-white/5 bg-muted/30")}>
      <div className="mb-2 h-1 overflow-hidden rounded-full bg-muted/60">
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
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm font-medium text-foreground">{activeSlide.alt}</p>
        <p className="shrink-0 text-xs tabular-nums text-muted-foreground">
          {activeIndex + 1} / {heroSlides.length}
        </p>
      </div>
    </div>
  );

  const slideArea = (
    <div
      className={cn(
        "group relative w-full",
        isMinimal
          ? "aspect-[10/16] max-h-[560px] sm:aspect-[4/5]"
          : "aspect-[10/16] max-h-[520px] bg-[#0c0c0e] sm:aspect-[4/5] sm:max-h-none",
      )}
    >
      {heroSlides.map((slide, index) => (
        <div
          key={slide.src}
          className={cn(
            "absolute inset-0 transition-all duration-700 ease-out",
            index === activeIndex ? "z-10 scale-100 opacity-100" : "z-0 scale-[0.98] opacity-0",
          )}
          aria-hidden={index !== activeIndex}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="(max-width: 1024px) 90vw, 480px"
            priority={index === 0}
            className={cn("object-contain", isMinimal ? "p-0" : "p-3 sm:p-5")}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={goPrev}
        aria-label="Önceki slayt"
        className="absolute left-0 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-background/70 text-foreground opacity-0 backdrop-blur-md transition-all hover:border-primary/40 hover:bg-background/90 group-hover:opacity-100 sm:left-2"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        type="button"
        onClick={goNext}
        aria-label="Sonraki slayt"
        className="absolute right-0 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-background/70 text-foreground opacity-0 backdrop-blur-md transition-all hover:border-primary/40 hover:bg-background/90 group-hover:opacity-100 sm:right-2"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );

  if (isMinimal) {
    return (
      <div className={cn("relative w-full", className)}>
        {slideArea}
        {controls}
      </div>
    );
  }

  return (
    <div className={cn("relative w-full", className)}>
      <div
        className="pointer-events-none absolute -right-8 top-1/2 size-56 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-6 top-8 size-32 rounded-full bg-accent/10 blur-2xl"
        aria-hidden
      />

      <div className="relative">
        <div className="absolute -inset-px rounded-[1.75rem] bg-gradient-to-br from-primary/40 via-transparent to-accent/30 opacity-80" />
        <div className="relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-card/90 shadow-card backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-white/5 bg-muted/40 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-red-400/80" />
              <span className="size-2.5 rounded-full bg-amber-400/80" />
              <span className="size-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <p className="truncate text-xs text-muted-foreground">{activeSlide.alt}</p>
            <p className="text-xs tabular-nums text-muted-foreground">
              {activeIndex + 1}/{heroSlides.length}
            </p>
          </div>

          {slideArea}
          {controls}
        </div>
      </div>
    </div>
  );
}
