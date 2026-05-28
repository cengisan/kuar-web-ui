"use client";

import { Banknote, CreditCard, Smartphone, UtensilsCrossed } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/cn";
import type { Translations } from "@/types";

export type CashierPaymentMethod =
  | "CASH"
  | "CREDIT_CARD"
  | "MEAL_CARD"
  | "MOBILE_PAYMENT";

const METHODS: {
  key: CashierPaymentMethod;
  icon: typeof Banknote;
  labelKey: keyof Translations;
}[] = [
  { key: "CASH", icon: Banknote, labelKey: "cash" },
  { key: "CREDIT_CARD", icon: CreditCard, labelKey: "creditCard" },
  { key: "MEAL_CARD", icon: UtensilsCrossed, labelKey: "mealCard" },
  { key: "MOBILE_PAYMENT", icon: Smartphone, labelKey: "mobilePayment" },
];

interface CashierPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  translations: Translations;
  currency: string;
  amount: number;
  description?: string;
  selectedMethod: CashierPaymentMethod | null;
  onSelectMethod: (method: CashierPaymentMethod) => void;
  onConfirm: () => void;
  loading?: boolean;
}

export function CashierPaymentDialog({
  open,
  onOpenChange,
  translations,
  currency,
  amount,
  description,
  selectedMethod,
  onSelectMethod,
  onConfirm,
  loading,
}: CashierPaymentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{translations.paymentMethod}</DialogTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </DialogHeader>

        <div className="rounded-xl border border-border bg-muted/40 px-4 py-4 text-center">
          <p className="text-2xl font-bold text-primary tabular-nums">
            {amount.toFixed(2)} {currency}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {METHODS.map((method) => {
            const Icon = method.icon;
            const selected = selectedMethod === method.key;
            const label =
              (translations[method.labelKey] as string) || method.key;
            return (
              <button
                key={method.key}
                type="button"
                onClick={() => onSelectMethod(method.key)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors",
                  selected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:bg-muted/40"
                )}
              >
                <Icon className={cn("h-7 w-7", selected && "text-primary")} />
                <span className={cn("text-sm font-medium", selected && "text-primary")}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {translations.cancel}
          </Button>
          <Button
            onClick={onConfirm}
            loading={loading}
            disabled={!selectedMethod}
          >
            {translations.confirmPayment || translations.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
