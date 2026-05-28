"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/presentation/state/hooks";
import { Spinner } from "@/components/ui/spinner";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { accessToken, isAuthenticated } = useAppSelector((s) => s.user);

  useEffect(() => {
    if (!accessToken && !isAuthenticated) {
      router.replace("/login");
    }
  }, [accessToken, isAuthenticated, router]);

  if (!accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
