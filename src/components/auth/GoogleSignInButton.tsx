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
 * Shows Kuar-styled button; invisible Google iframe on top receives clicks.
 * Google's personalized "Sign in as …" UI must not be visible.
 */
export function GoogleSignInButton({
  label,
  disabled,
  onSuccess,
  onError,
  className,
}: GoogleSignInButtonProps) {
  return (
    <div className={cn("relative h-11 w-full", className)}>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="pointer-events-none h-11 w-full"
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
          "absolute inset-0 z-10 overflow-hidden opacity-0",
          disabled ? "pointer-events-none" : "cursor-pointer"
        )}
        aria-label={label}
        role="button"
      >
        <div className="flex h-full w-full items-stretch justify-center [&>div]:!h-full [&>div]:!w-full [&_iframe]:!h-full [&_iframe]:!w-full">
          <GoogleLogin
            onSuccess={onSuccess}
            onError={onError}
            useOneTap={false}
            auto_select={false}
            type="standard"
            theme="outline"
            text="signin_with"
            shape="rectangular"
            size="large"
            width="400"
            containerProps={{
              className: "flex h-full w-full items-center justify-center",
              style: { width: "100%", height: "100%" },
            }}
          />
        </div>
      </div>
    </div>
  );
}
