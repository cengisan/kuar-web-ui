"use client";

import Image from "next/image";
import { assets } from "@/config/assets";
import { cn } from "@/lib/cn";

type CardBrand = "visa" | "mastercard" | "amex" | "troy";

const brandImages: Record<CardBrand, (typeof assets.brands)[CardBrand]> = {
  visa: assets.brands.visa,
  mastercard: assets.brands.mastercard,
  amex: assets.brands.amex,
  troy: assets.brands.troy,
};

export function formatCardNumberDisplay(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "•••• •••• •••• ••••";
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

export function formatCardNumberInput(text: string) {
  const digits = text.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

export function detectCardBrand(cardNumber: string): CardBrand | null {
  const num = cardNumber.replace(/\s/g, "");
  if (num.length < 1) return null;
  if (/^4/.test(num)) return "visa";
  if (/^3[47]/.test(num)) return "amex";
  if (/^9792/.test(num)) return "troy";
  if (/^5[1-5]/.test(num) || /^2(2[2-9]|[3-6]|7[01])/.test(num)) return "mastercard";
  return null;
}

interface PaymentCardPreviewProps {
  cardNumber: string;
  cardHolderName: string;
  expireMonth: string;
  expireYear: string;
  cvc: string;
  holderPlaceholder?: string;
  monthPlaceholder?: string;
  yearPlaceholder?: string;
  cvcPlaceholder?: string;
  className?: string;
}

export function PaymentCardPreview({
  cardNumber,
  cardHolderName,
  expireMonth,
  expireYear,
  cvc,
  holderPlaceholder = "CARD HOLDER",
  monthPlaceholder = "MM",
  yearPlaceholder = "YYYY",
  cvcPlaceholder = "CVC",
  className,
}: PaymentCardPreviewProps) {
  const brand = detectCardBrand(cardNumber);
  const displayNumber = formatCardNumberDisplay(cardNumber);
  const displayYear =
    expireYear.length === 4 ? expireYear.slice(2) : expireYear || yearPlaceholder;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black p-5 shadow-lg",
        "min-h-[168px] flex flex-col justify-between",
        className
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-primary/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-6 size-28 rounded-full bg-primary/5 blur-2xl" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="size-9 rounded-md bg-gradient-to-br from-amber-200/90 to-amber-500/70 shadow-inner" />
        {brand && (
          <Image
            src={brandImages[brand]}
            alt={brand}
            width={brandImages[brand].width}
            height={brandImages[brand].height}
            className="h-8 w-auto object-contain"
          />
        )}
      </div>

      <p className="relative mt-6 font-mono text-lg tracking-[0.2em] text-white sm:text-xl">
        {displayNumber}
      </p>

      <div className="relative mt-4 space-y-3">
        <p className="truncate text-sm uppercase tracking-wide text-white/90">
          {cardHolderName.trim() || holderPlaceholder}
        </p>
        <div className="flex items-center justify-between text-sm text-white/90">
          <span className="font-mono tracking-wider">
            {(expireMonth || monthPlaceholder)}/{displayYear}
          </span>
          <span className="font-mono tracking-wider pr-6">
            {cvc || cvcPlaceholder}
          </span>
        </div>
      </div>
    </div>
  );
}
