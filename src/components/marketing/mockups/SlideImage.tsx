"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { cn } from "@/lib/cn";
import { SLIDE_IMAGE_QUALITY } from "@/config/slideImageConfig";

export function SlideImage({
  src,
  alt,
  priority,
  className,
  sizes = "(max-width: 1280px) 100vw, 1920px",
  quality = SLIDE_IMAGE_QUALITY,
}: {
  src: StaticImageData;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
  quality?: number;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={src.width}
      height={src.height}
      sizes={sizes}
      quality={quality}
      priority={priority}
      className={cn("h-auto w-full max-w-none", className)}
    />
  );
}

export function SlideCrossfade({
  slides,
  activeIndex,
  priorityFirst = false,
  className,
  sizes,
  quality,
}: {
  slides: { src: StaticImageData; alt: string }[];
  activeIndex: number;
  priorityFirst?: boolean;
  className?: string;
  sizes?: string;
  quality?: number;
}) {
  const active = slides[activeIndex]?.src ?? slides[0]?.src;

  return (
    <div
      className={cn("relative w-full", className)}
      style={active ? { aspectRatio: `${active.width} / ${active.height}` } : undefined}
    >
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
          <SlideImage
            src={slide.src}
            alt={slide.alt}
            priority={priorityFirst && index === 0}
            sizes={sizes}
            quality={quality}
          />
        </div>
      ))}
    </div>
  );
}
