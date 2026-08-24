"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import type { CredentialResponse } from "@react-oauth/google";
import { useGoogleOAuth } from "@react-oauth/google";

import { Button } from "@/components/ui/button";
import { assets } from "@/config/assets";
import { googleClientId } from "@/config/googleAuth";
import { cn } from "@/lib/cn";

interface GoogleSignInButtonProps {
  label: string;
  disabled?: boolean;
  onSuccess: (response: CredentialResponse) => void;
  onError: () => void;
  className?: string;
}

export function GoogleSignInButton({
  label,
  disabled,
  onSuccess,
  onError,
  className,
}: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const googleHostRef = useRef<HTMLDivElement>(null);
  const { scriptLoadedSuccessfully } = useGoogleOAuth();
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const renderGoogleButton = useCallback(() => {
    const host = googleHostRef.current;
    const container = containerRef.current;
    const googleAccounts = window.google?.accounts?.id;

    if (!host || !container || !googleAccounts) {
      return;
    }

    host.innerHTML = "";
    const width = Math.max(container.offsetWidth, 240);

    googleAccounts.renderButton(host, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "signin_with",
      shape: "rectangular",
      width,
      logo_alignment: "left",
    });
  }, []);

  useEffect(() => {
    if (!scriptLoadedSuccessfully) {
      return;
    }

    window.google?.accounts?.id?.initialize({
      client_id: googleClientId,
      callback: (response: CredentialResponse) => {
        if (response.credential) {
          onSuccessRef.current(response);
          return;
        }
        onError();
      },
      auto_select: false,
      cancel_on_tap_outside: true,
      use_fedcm_for_button: false,
    });
  }, [scriptLoadedSuccessfully, onError]);

  useEffect(() => {
    if (!scriptLoadedSuccessfully || disabled) {
      return;
    }

    renderGoogleButton();

    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => {
      renderGoogleButton();
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, [disabled, renderGoogleButton, scriptLoadedSuccessfully]);

  return (
    <div ref={containerRef} className={cn("relative h-11 w-full", className)}>
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
        ref={googleHostRef}
        className={cn(
          "absolute inset-0 z-10 overflow-hidden",
          "[&>div]:!h-full [&>div]:!w-full [&_iframe]:!h-full [&_iframe]:!w-full",
          disabled ? "pointer-events-none opacity-50" : "cursor-pointer"
        )}
        style={{ opacity: 0.0001 }}
        aria-label={label}
      />
    </div>
  );
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}
