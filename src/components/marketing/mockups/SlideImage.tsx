"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { cn } from "@/lib/cn";

export function SlideImage({
  src,
  alt,
  priority,
  className,
  sizes = "(max-width: 768px) 90vw, 560px",
}: {
  src: StaticImageData;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  return (
    <div
      className={cn("relative w-full", className)}
      style={{ aspectRatio: `${src.width} / ${src.height}` }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-contain"
      />
    </div>
  );
}

export function SlideCrossfade({
  slides,
  activeIndex,
  priorityFirst = false,
  className,
  sizes,
}: {
  slides: { src: StaticImageData; alt: string }[];
  activeIndex: number;
  priorityFirst?: boolean;
  className?: string;
  sizes?: string;
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
          />
        </div>
      ))}
    </div>
  );
}
