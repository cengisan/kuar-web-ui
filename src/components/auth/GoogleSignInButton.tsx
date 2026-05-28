"use client";

import Image from "next/image";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

import { Button } from "@/components/ui/button";
import { assets } from "@/config/assets";
import { cn } from "@/lib/cn";

interface GoogleSignInButtonProps {
  label: string;
  disabled?: boolean;
  onSuccess: (response: CredentialResponse) => void;
  onError: () => void;
  className?: string;
}

/**
 * Renders a styled Kuar button with the real Google Sign-In control layered on top.
 * Programmatic clicks on Google's iframe do not work reliably in production.
 */
export function GoogleSignInButton({
  label,
  disabled,
  onSuccess,
  onError,
  className,
}: GoogleSignInButtonProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="pointer-events-none w-full"
        disabled={disabled}
        tabIndex={-1}
        aria-hidden
      >
        <Image
          src={assets.google}
          alt=""
          width={assets.google.width}
          height={assets.google.height}
          className="size-4"
          aria-hidden
        />
        {label}
      </Button>

      <div
        className={cn(
          "absolute inset-0 z-10 flex items-center justify-center overflow-hidden",
          disabled && "pointer-events-none opacity-50"
        )}
        aria-label={label}
      >
        <div className="google-sign-in-host flex h-11 w-full max-w-full items-center justify-center [&>div]:!w-full [&_iframe]:!min-h-11">
          <GoogleLogin
            onSuccess={onSuccess}
            onError={onError}
            useOneTap={false}
            type="standard"
            theme="outline"
            size="large"
            width="400"
            containerProps={{
              className: "flex w-full justify-center",
              style: { width: "100%" },
            }}
          />
        </div>
      </div>
    </div>
  );
}
