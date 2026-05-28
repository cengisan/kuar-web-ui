"use client";

import * as React from "react";
import { Check, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface ModuleUpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleName: string;
  description?: string;
  features?: string[];
  priceLabel?: string;
  onUpgrade?: () => void;
  upgrading?: boolean;
}

export function ModuleUpgradeModal({
  open,
  onOpenChange,
  moduleName,
  description,
  features,
  priceLabel,
  onUpgrade,
  upgrading,
}: ModuleUpgradeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/15">
            <Sparkles className="size-6 text-primary" aria-hidden="true" />
          </div>
          <DialogTitle>{moduleName} modülünü etkinleştir</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {features && features.length > 0 && (
          <ul className="space-y-2.5">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-sm text-foreground"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}

        {priceLabel && (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
              Aylık
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {priceLabel}
            </p>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Şimdi değil
          </Button>
          <Button type="button" onClick={onUpgrade} loading={upgrading}>
            Yükselt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
