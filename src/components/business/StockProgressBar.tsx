"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib/cn";

export interface StockProgressBarProps {
  current: number;
  total: number;
  unit?: string;
  label?: string;
  /** Percentage at or below which the bar turns warning. Default 30. */
  warningThreshold?: number;
  /** Percentage at or below which the bar turns destructive. Default 10. */
  dangerThreshold?: number;
  className?: string;
}

export function StockProgressBar({
  current,
  total,
  unit,
  label,
  warningThreshold = 30,
  dangerThreshold = 10,
  className,
}: StockProgressBarProps) {
  const safeTotal = Math.max(total, 0);
  const safeCurrent = Math.max(0, Math.min(current, safeTotal || current));
  const percent =
    safeTotal === 0 ? 0 : Math.min(100, (safeCurrent / safeTotal) * 100);

  const tone =
    percent <= dangerThreshold
      ? "danger"
      : percent <= warningThreshold
        ? "warning"
        : "ok";

  const barColor =
    tone === "danger"
      ? "bg-destructive"
      : tone === "warning"
        ? "bg-amber-500"
        : "bg-primary";

  const labelColor =
    tone === "danger"
      ? "text-destructive"
      : tone === "warning"
        ? "text-amber-400"
        : "text-foreground";

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">
          {label ?? "Stok"}
          {tone === "danger" && (
            <AlertTriangle
              className="ml-1.5 inline size-3.5 text-destructive"
              aria-hidden="true"
            />
          )}
        </span>
        <span className={cn("font-semibold tabular-nums", labelColor)}>
          {safeCurrent}
          {unit ? ` ${unit}` : ""}
          <span className="text-[var(--muted-foreground)]">
            {" "}
            / {safeTotal}
            {unit ? ` ${unit}` : ""}
          </span>
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeTotal}
        aria-valuenow={safeCurrent}
        aria-label={label ?? "Stok"}
        className="h-2 w-full overflow-hidden rounded-full bg-[var(--muted)]"
      >
        <div
          className={cn("h-full rounded-full transition-[width]", barColor)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
