"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { cn } from "@/lib/cn";

type FrameImageProps = {
  src: StaticImageData;
  alt: string;
  priority?: boolean;
  className?: string;
};

function FrameImage({ src, alt, priority, className }: FrameImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 90vw, 560px"
      priority={priority}
      className={cn("object-cover object-top", className)}
    />
  );
}

export function BrowserFrame({
  src,
  alt,
  priority,
  className,
  url = "app.kuar.io",
}: {
  src: StaticImageData;
  alt: string;
  priority?: boolean;
  className?: string;
  url?: string;
}) {
  return (
    <div className={cn("mockup-browser relative", className)}>
      <div className="relative overflow-hidden rounded-[1.1rem] border border-white/10 bg-[#0a0a0c] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.65)]">
        <div className="flex items-center gap-2 border-b border-white/5 bg-[#141416] px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-red-400/80" />
            <span className="size-2.5 rounded-full bg-amber-400/80" />
            <span className="size-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <div className="mx-auto flex min-w-0 max-w-[70%] items-center justify-center rounded-md bg-black/40 px-3 py-1">
            <p className="truncate text-[10px] text-muted-foreground sm:text-xs">{url}</p>
          </div>
          <div className="size-6 shrink-0" aria-hidden />
        </div>
        <div className="relative aspect-[16/10] w-full bg-[#111113]">
          <FrameImage src={src} alt={alt} priority={priority} />
        </div>
      </div>
    </div>
  );
}

export function PhoneFrame({
  src,
  alt,
  priority,
  className,
}: {
  src: StaticImageData;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("mockup-phone relative", className)}>
      <div className="relative overflow-hidden rounded-[2rem] border-[3px] border-[#2a2a2e] bg-[#0a0a0c] p-1.5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] sm:rounded-[2.25rem] sm:border-[4px] sm:p-2">
        <div className="absolute left-1/2 top-2.5 z-10 h-[18px] w-[72px] -translate-x-1/2 rounded-full bg-black sm:top-3 sm:h-5 sm:w-20" />
        <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[1.55rem] bg-[#111113] sm:rounded-[1.85rem]">
          <FrameImage src={src} alt={alt} priority={priority} />
        </div>
      </div>
    </div>
  );
}

export function MockupCrossfade({
  slides,
  activeIndex,
  platform,
  priorityFirst = false,
}: {
  slides: { src: StaticImageData; alt: string }[];
  activeIndex: number;
  platform: "web" | "mobile";
  priorityFirst?: boolean;
}) {
  const Frame = platform === "web" ? BrowserFrame : PhoneFrame;

  return (
    <div className="relative h-full w-full">
      {slides.map((slide, index) => (
        <div
          key={`${slide.alt}-${index}`}
          className={cn(
            "absolute inset-0 transition-all duration-700 ease-out",
            index === activeIndex
              ? "z-10 translate-y-0 scale-100 opacity-100"
              : "z-0 translate-y-1 scale-[0.98] opacity-0",
          )}
          aria-hidden={index !== activeIndex}
        >
          <Frame
            src={slide.src}
            alt={slide.alt}
            priority={priorityFirst && index === 0}
          />
        </div>
      ))}
    </div>
  );
}
