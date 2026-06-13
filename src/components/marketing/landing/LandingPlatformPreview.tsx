"use client";

import { useEffect, useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/cn";
import { platformGallerySlides, pickSlideImage } from "@/config/slideAssets";
import { SlideImage } from "@/components/marketing/mockups/SlideImage";

type Platform = "web" | "mobile";

export function LandingPlatformPreview() {
  const [platform, setPlatform] = useState<Platform>("web");
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  const activeSlide = platformGallerySlides[activeIndex];
  const isFullLayout = activeSlide.layout === "full";
  const image = pickSlideImage(activeSlide, isFullLayout ? "mobile" : platform);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % platformGallerySlides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [reduceMotion, platform]);

  return (
    <section className="landing-section overflow-hidden border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-12">
          <div>
            <p className="landing-eyebrow">Her cihazda aynı deneyim</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              Web paneli ve mobil uygulama birlikte çalışır
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Sahada mobil uygulama ile sipariş alın, ofiste web panelinden raporları inceleyin.
              Tüm ekranlar gerçek ürün arayüzlerinden alınmıştır.
            </p>

            <div className="mt-8 inline-flex rounded-full border border-border/70 bg-muted/20 p-1">
              <button
                type="button"
                onClick={() => setPlatform("web")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                  platform === "web"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Monitor className="size-4" />
                Web paneli
              </button>
              <button
                type="button"
                onClick={() => setPlatform("mobile")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                  platform === "mobile"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Smartphone className="size-4" />
                Mobil uygulama
              </button>
            </div>

            <div className="mt-8 space-y-2">
              {platformGallerySlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-300",
                    index === activeIndex
                      ? "border-primary/30 bg-primary/5"
                      : "border-transparent hover:border-border hover:bg-muted/25",
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 shrink-0 rounded-full transition-colors",
                      index === activeIndex ? "bg-primary" : "bg-muted-foreground/40",
                    )}
                  />
                  <span className="text-sm font-medium">{slide.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
            <div
              className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/10 via-transparent to-accent/10 blur-2xl"
              aria-hidden
            />
            <div
              key={`${platform}-${activeSlide.id}`}
              className={cn(
                "relative slide-preview-enter lg:scale-[1.08] lg:origin-center",
                !isFullLayout &&
                  platform === "mobile" &&
                  "mx-auto max-w-[380px] sm:max-w-[420px] lg:max-w-[460px]",
              )}
            >
              <SlideImage
                src={image}
                alt={activeSlide.title}
                priority
                sizes={
                  platform === "mobile"
                    ? "(max-width: 1024px) 85vw, 460px"
                    : "(max-width: 1024px) 100vw, 820px"
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
