"use client";

import * as React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import StoreProvider from "@/presentation/state/StoreProvider";
import { Toaster } from "@/components/providers/Toaster";
import { ThemeSync } from "@/components/layout/ThemeSync";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { googleClientId, isGoogleAuthConfigured } from "@/config/googleAuth";

export function Providers({ children }: { children: React.ReactNode }) {
  const content = (
    <StoreProvider>
      <ThemeSync />
      <LocaleProvider />
      {children}
      <Toaster />
    </StoreProvider>
  );

  if (isGoogleAuthConfigured) {
    return <GoogleOAuthProvider clientId={googleClientId}>{content}</GoogleOAuthProvider>;
  }

  return content;
}
