"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export function RotatingHighlight({
  words,
  intervalMs = 2800,
  className,
}: {
  words: readonly string[];
  intervalMs?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (words.length <= 1) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const timer = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((current) => (current + 1) % words.length);
        setVisible(true);
      }, 220);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [intervalMs, words.length]);

  return (
    <span
      className={cn(
        "inline-block gradient-text transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        className,
      )}
    >
      {words[index]}
    </span>
  );
}
