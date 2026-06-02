"use client";

import { cn } from "@/lib/cn";

export interface StockPercentageBarProps {
  percentage?: number;
  className?: string;
}

export function StockPercentageBar({
  percentage = 0,
  className,
}: StockPercentageBarProps) {
  const safePercentage = Math.max(0, Math.min(100, percentage || 0));
  const barColor =
    safePercentage <= 25
      ? "bg-destructive"
      : safePercentage <= 50
        ? "bg-amber-500"
        : "bg-primary";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safePercentage}
        className="h-2 flex-1 overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn("h-full rounded-full transition-[width]", barColor)}
          style={{ width: `${safePercentage}%` }}
        />
      </div>
      <span className="min-w-[2.5rem] text-right text-xs tabular-nums text-muted-foreground">
        {safePercentage.toFixed(0)}%
      </span>
    </div>
  );
}
