"use client";

import * as React from "react";
import { ChevronRight, Lock, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";

export interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  color?: string;
  description?: string;
  locked?: boolean;
  onClick?: () => void;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  color = "var(--primary)",
  description,
  locked,
  onClick,
  className,
}: FeatureCardProps) {
  const interactive = !!onClick;

  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div
          className="relative flex size-12 items-center justify-center rounded-xl shadow-sm ring-1 ring-white/10"
          style={{
            background: `linear-gradient(135deg, ${color} 0%, color-mix(in srgb, ${color} 70%, black) 100%)`,
          }}
        >
          <Icon className="size-6 text-white" aria-hidden="true" />
          {locked && (
            <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full border-2 border-card bg-muted shadow-sm">
              <Lock className="size-3 text-muted-foreground" aria-hidden="true" />
            </span>
          )}
        </div>

        {interactive && !locked && (
          <ChevronRight
            className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary group-hover:opacity-100"
            aria-hidden
          />
        )}
      </div>

      <div className="mt-4 min-w-0 flex-1">
        <h3
          className={cn(
            "truncate text-sm font-semibold tracking-tight text-foreground",
            locked && "text-muted-foreground"
          )}
        >
          {title}
        </h3>
        {description && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </>
  );

  const baseClasses = cn(
    "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300",
    interactive &&
      !locked &&
      "cursor-pointer hover:-translate-y-1 hover:border-primary/35 hover:bg-card hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    locked && "cursor-not-allowed opacity-75",
    className
  );

  if (interactive) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-disabled={locked || undefined}
        className={cn(baseClasses, "text-left")}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at top right, color-mix(in srgb, ${color} 12%, transparent), transparent 65%)`,
          }}
          aria-hidden
        />
        <div className="relative">{content}</div>
      </button>
    );
  }

  return <div className={baseClasses}>{content}</div>;
}
