"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const OTP_LENGTH = 6;

export interface ActivationFormProps {
  email?: string;
  onSubmit?: (code: string) => Promise<void> | void;
  onResend?: () => Promise<void> | void;
  loading?: boolean;
  className?: string;
  /** Cooldown seconds before resend is allowed again. Defaults to 60. */
  resendCooldownSeconds?: number;
}

export function ActivationForm({
  email,
  onSubmit,
  onResend,
  loading,
  className,
  resendCooldownSeconds = 60,
}: ActivationFormProps) {
  const [digits, setDigits] = React.useState<string[]>(() =>
    Array(OTP_LENGTH).fill("")
  );
  const [error, setError] = React.useState<string | null>(null);
  const [cooldown, setCooldown] = React.useState(0);
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);

  React.useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => {
      setCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const code = digits.join("");
  const isComplete = code.length === OTP_LENGTH;

  const handleChange = (index: number, raw: string) => {
    const value = raw.replace(/\D/g, "");
    if (!value) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    setError(null);

    if (value.length > 1) {
      const chars = value.slice(0, OTP_LENGTH - index).split("");
      setDigits((prev) => {
        const next = [...prev];
        chars.forEach((c, i) => {
          next[index + i] = c;
        });
        return next;
      });
      const lastIndex = Math.min(index + chars.length, OTP_LENGTH - 1);
      inputsRef.current[lastIndex]?.focus();
      return;
    }

    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });

    if (index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
      setDigits((prev) => {
        const next = [...prev];
        next[index - 1] = "";
        return next;
      });
      event.preventDefault();
    }
    if (event.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isComplete) {
      setError("6 haneli doğrulama kodunu eksiksiz girin");
      return;
    }
    setError(null);
    await onSubmit?.(code);
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    await onResend?.();
    setCooldown(resendCooldownSeconds);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("w-full max-w-md space-y-6", className)}
      noValidate
    >
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          E-posta Doğrulama
        </h1>
        <p className="text-sm text-muted-foreground">
          {email
            ? `${email} adresine gönderilen 6 haneli kodu gir`
            : "E-postana gelen 6 haneli kodu gir"}
        </p>
      </div>

      <div
        className="flex justify-center gap-2"
        role="group"
        aria-label="6-digit verification code"
      >
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={OTP_LENGTH}
            value={digit}
            aria-label={`Digit ${index + 1}`}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={cn(
              "size-12 rounded-lg border border-border bg-card text-center text-lg font-semibold text-foreground sm:size-14 sm:text-xl",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent",
              "transition-colors",
              error && "border-destructive"
            )}
          />
        ))}
      </div>

      {error && (
        <p className="text-center text-xs text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        loading={loading}
        disabled={!isComplete || loading}
      >
        Doğrula
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Kod gelmedi mi?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0 || !onResend}
          className={cn(
            "font-medium text-primary hover:underline",
            (cooldown > 0 || !onResend) &&
              "pointer-events-none opacity-60 hover:no-underline"
          )}
        >
          {cooldown > 0 ? `Tekrar gönder (${cooldown}s)` : "Tekrar gönder"}
        </button>
      </div>
    </form>
  );
}
