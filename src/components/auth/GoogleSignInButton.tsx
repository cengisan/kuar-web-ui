"use client";

import Image from "next/image";
import { useGoogleLogin, useGoogleOAuth } from "@react-oauth/google";

import { Button } from "@/components/ui/button";
import { assets } from "@/config/assets";
import { getGoogleOAuthRedirectUri } from "@/config/googleAuth";
import { cn } from "@/lib/cn";

interface GoogleSignInButtonProps {
  label: string;
  disabled?: boolean;
  onCode: (code: string, redirectUri: string) => void;
  onError: () => void;
  className?: string;
}

export function GoogleSignInButton({
  label,
  disabled,
  onCode,
  onError,
  className,
}: GoogleSignInButtonProps) {
  const { scriptLoadedSuccessfully } = useGoogleOAuth();

  const login = useGoogleLogin({
    flow: "auth-code",
    ux_mode: "popup",
    onSuccess: (response) => {
      if (response.code) {
        onCode(response.code, getGoogleOAuthRedirectUri());
      } else {
        onError();
      }
    },
    onError: () => onError(),
    onNonOAuthError: (error) => {
      if (error.type === "popup_closed") {
        return;
      }
      onError();
    },
  });

  const handleClick = () => {
    if (!scriptLoadedSuccessfully) {
      onError();
      return;
    }
    login();
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className={cn("w-full", className)}
      disabled={disabled || !scriptLoadedSuccessfully}
      onClick={handleClick}
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
  );
}
