"use client";

import { Banknote, CheckCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Translations } from "@/types";
import { cn } from "@/lib/cn";

interface CashierActionBarProps {
  translations: Translations;
  currency: string;
  remainingAmount: number;
  selectedCount: number;
  selectedTotal: number;
  actionLoading?: boolean;
  onPayAll: () => void;
  onPaySelected: () => void;
  onCloseOrder: () => void;
}

export function CashierActionBar({
  translations,
  currency,
  remainingAmount,
  selectedCount,
  selectedTotal,
  actionLoading,
  onPayAll,
  onPaySelected,
  onCloseOrder,
}: CashierActionBarProps) {
  const canClose = remainingAmount <= 0;
  const hasUnpaid = remainingAmount > 0;

  return (
    <div className="sticky bottom-0 z-50 -mx-1 mt-6 border-t border-border bg-card/95 p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.35)] backdrop-blur sm:-mx-2">
      {selectedCount > 0 && (
        <div className="mb-3 flex justify-between text-sm text-primary">
          <span>
            {selectedCount} {translations.itemSelected}
          </span>
          <span className="font-bold tabular-nums">
            {selectedTotal.toFixed(2)} {currency}
          </span>
        </div>
      )}

      {hasUnpaid && (
        <p className="mb-3 text-center text-xs text-muted-foreground">
          {translations.payBeforeCloseHint}
        </p>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
        {selectedCount > 0 ? (
          <Button
            className="flex-1"
            variant="outline"
            onClick={onPaySelected}
            loading={actionLoading}
          >
            <Banknote />
            {translations.paySelected}
          </Button>
        ) : hasUnpaid ? (
          <Button className="flex-1" onClick={onPayAll} loading={actionLoading}>
            <Banknote />
            {translations.payAll} — {remainingAmount.toFixed(2)}{" "}
            {currency}
          </Button>
        ) : null}

        <Button
          className={cn("flex-1", !canClose && "opacity-80")}
          variant={canClose ? "default" : "outline"}
          disabled={!canClose || actionLoading}
          onClick={onCloseOrder}
        >
          <CheckCheck />
          {translations.closeOrder}
        </Button>
      </div>
    </div>
  );
}
