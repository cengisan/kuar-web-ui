"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { appleClientId, getAppleRedirectUri } from "@/config/appleAuth";
import { cn } from "@/lib/cn";

interface AppleSignInButtonProps {
  label: string;
  disabled?: boolean;
  onSuccess: (idToken: string) => void;
  onError: () => void;
  className?: string;
}

const APPLE_SDK_URL =
  "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";

export function AppleSignInButton({
  label,
  disabled,
  onSuccess,
  onError,
  className,
}: AppleSignInButtonProps) {
  const [sdkReady, setSdkReady] = useState(false);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  useEffect(() => {
    if (window.AppleID) {
      setSdkReady(true);
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${APPLE_SDK_URL}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => setSdkReady(true));
      return;
    }

    const script = document.createElement("script");
    script.src = APPLE_SDK_URL;
    script.async = true;
    script.onload = () => setSdkReady(true);
    script.onerror = () => {
      console.error("Failed to load Apple Sign-In SDK");
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!sdkReady || !window.AppleID) return;

    window.AppleID.auth.init({
      clientId: appleClientId,
      scope: "name email",
      redirectURI: getAppleRedirectUri(),
      usePopup: true,
    });
  }, [sdkReady]);

  const handleClick = useCallback(async () => {
    if (!sdkReady || !window.AppleID || disabled) return;

    try {
      const response = await window.AppleID.auth.signIn();
      const idToken = response.authorization?.id_token;

      if (idToken) {
        onSuccessRef.current(idToken);
      } else {
        onErrorRef.current();
      }
    } catch {
      onErrorRef.current();
    }
  }, [sdkReady, disabled]);

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className={cn(
        "h-11 w-full border-black bg-black text-white",
        "hover:bg-black/90 hover:text-white hover:border-black",
        "focus-visible:ring-0 focus-visible:ring-offset-0",
        "active:bg-black/80",
        className
      )}
      disabled={disabled || !sdkReady}
      onClick={handleClick}
    >
      <AppleLogo className="size-4" />
      {label}
    </Button>
  );
}

function AppleLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 17 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M13.312 10.563c-.02-2.137 1.744-3.163 1.823-3.212-0.993-1.45-2.538-1.649-3.088-1.672-1.314-.133-2.565.774-3.232.774-.666 0-1.696-.754-2.786-.734-1.434.021-2.756.834-3.495 2.118-1.49 2.585-.381 6.415 1.071 8.513.71 1.025 1.556 2.178 2.667 2.137 1.069-.043 1.473-.692 2.766-.692 1.293 0 1.655.692 2.783.67 1.152-.019 1.879-1.045 2.585-2.073.815-1.189 1.15-2.341 1.171-2.401-.026-.012-2.245-.862-2.265-3.428zM11.182 3.88c.59-.714.988-1.706.879-2.693-.85.035-1.88.566-2.49 1.28-.547.633-1.025 1.644-.896 2.614.948.074 1.916-.482 2.507-1.201z" />
    </svg>
  );
}

declare global {
  interface Window {
    AppleID?: {
      auth: {
        init: (config: {
          clientId: string;
          scope: string;
          redirectURI: string;
          usePopup: boolean;
        }) => void;
        signIn: () => Promise<{
          authorization: {
            id_token: string;
            code: string;
          };
          user?: {
            email?: string;
            name?: { firstName?: string; lastName?: string };
          };
        }>;
      };
    };
  }
}
