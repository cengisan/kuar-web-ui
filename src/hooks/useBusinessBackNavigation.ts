"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getBusinessBackHref, businessesPagePath } from "@/utils/businessNavigation";

export function useBusinessBackNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const href = useMemo(
    () => getBusinessBackHref(pathname, searchParams) ?? businessesPagePath(),
    [pathname, searchParams]
  );

  const goBack = useCallback(() => {
    router.push(href);
  }, [router, href]);

  return { href, goBack };
}
