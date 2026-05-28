"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    console.error("App error boundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15">
        <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden="true" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold">{t("unexpectedErrorTitle")}</h1>
        <p className="mt-2 max-w-md text-muted-foreground">{t("unexpectedErrorDescription")}</p>
        {error.digest && (
          <p className="mt-2 text-xs text-muted-foreground">
            {t("errorCode")}:{" "}
            <code className="rounded bg-muted px-1.5 py-0.5">{error.digest}</code>
          </p>
        )}
      </div>
      <div className="flex gap-3">
        <Button onClick={() => reset()}>{t("tryAgain")}</Button>
        <Button asChild variant="outline">
          <Link href="/">{t("homePage")}</Link>
        </Button>
      </div>
    </div>
  );
}
