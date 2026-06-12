"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { heroSlides } from "@/config/assets";

const SLIDE_INTERVAL_MS = 2500;

export function HeroSlideCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const goTo = useCallback((index: number) => {
    setActiveIndex((index + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (reduceMotion || heroSlides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <div className="animate-fade-up-delay-2 relative mx-auto mt-16 max-w-4xl">
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div className="relative aspect-[16/10] w-full bg-muted/40">
          {heroSlides.map((slide, index) => (
            <Image
              key={slide.alt}
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(max-width: 896px) 100vw, 896px"
              priority={index === 0}
              className={cn(
                "object-contain transition-opacity duration-700 ease-in-out",
                index === activeIndex ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 border-t border-border bg-muted/30 px-4 py-3">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.alt}
              type="button"
              aria-label={`${slide.alt} slaytını göster`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => goTo(index)}
              className={cn(
                "size-2 rounded-full transition-all duration-300",
                index === activeIndex
                  ? "w-6 bg-primary"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
