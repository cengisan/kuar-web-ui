"use client";

import * as React from "react";
import { CreditCard, Banknote, Wallet, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardBrandIcons } from "@/components/marketing/CardBrandIcons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/cn";

export type PaymentMethod = "cash" | "card" | "wallet";

export type PaymentMode = "cashier" | "subscription";

export interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: PaymentMode;
  title?: string;
  description?: string;
  amount: number;
  currency?: string;
  /** Available payment methods. Defaults to all. */
  methods?: PaymentMethod[];
  defaultMethod?: PaymentMethod;
  onConfirm?: (method: PaymentMethod) => Promise<void> | void;
  loading?: boolean;
}

interface MethodOption {
  id: PaymentMethod;
  label: string;
  icon: LucideIcon;
}

const ALL_METHODS: MethodOption[] = [
  { id: "cash", label: "Nakit", icon: Banknote },
  { id: "card", label: "Kart", icon: CreditCard },
  { id: "wallet", label: "Cüzdan", icon: Wallet },
];

function formatAmount(amount: number, currency = "TRY") {
  try {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export function PaymentModal({
  open,
  onOpenChange,
  mode = "cashier",
  title,
  description,
  amount,
  currency = "TRY",
  methods,
  defaultMethod = "card",
  onConfirm,
  loading,
}: PaymentModalProps) {
  const visibleMethods = React.useMemo(
    () =>
      methods && methods.length > 0
        ? ALL_METHODS.filter((m) => methods.includes(m.id))
        : ALL_METHODS,
    [methods]
  );

  const [selected, setSelected] = React.useState<PaymentMethod>(defaultMethod);
  const [wasOpen, setWasOpen] = React.useState(open);

  // Reset to the default method whenever the modal transitions to open.
  // Storing previous prop avoids a setState-in-effect cascade.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setSelected(defaultMethod);
    }
  }

  const resolvedTitle =
    title ?? (mode === "subscription" ? "Aboneliği Tamamla" : "Ödeme Al");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{resolvedTitle}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-5 text-center">
          <p className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
            Toplam
          </p>
          <p className="mt-1 text-3xl font-bold text-foreground tabular-nums">
            {formatAmount(amount, currency)}
          </p>
        </div>

        <div
          role="radiogroup"
          aria-label="Ödeme yöntemi"
          className="grid grid-cols-3 gap-2"
        >
          {visibleMethods.map((m) => {
            const Icon = m.icon;
            const active = selected === m.id;
            return (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setSelected(m.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-lg border-2 px-3 py-4 text-sm transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-[var(--border)] bg-card text-[var(--muted-foreground)] hover:border-primary/40 hover:text-foreground"
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
                <span className="font-medium">{m.label}</span>
              </button>
            );
          })}
        </div>

        {(selected === "card" || mode === "subscription") && (
          <CardBrandIcons className="justify-center" />
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            İptal
          </Button>
          <Button
            type="button"
            onClick={() => onConfirm?.(selected)}
            loading={loading}
          >
            {mode === "subscription" ? "Aboneliği Başlat" : "Ödemeyi Onayla"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
