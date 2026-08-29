"use client";

import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import { PageBackLink } from "@/components/layout/PageBackLink";
import { PageHomeLink } from "@/components/layout/PageHomeLink";
import { useAppSelector } from "@/presentation/state/hooks";
import {
  businessHomePath,
  businessesPagePath,
  getBusinessBackHref,
} from "@/utils/businessNavigation";

export interface PageLayoutBackConfig {
  label: React.ReactNode;
  href?: string;
  onClick?: () => void;
  replace?: boolean;
}

export interface PageLayoutHomeConfig {
  label?: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface PageLayoutProps {
  children: React.ReactNode;
  back?: PageLayoutBackConfig;
  /** Pass `false` to hide the home shortcut on business module sub-pages. */
  home?: PageLayoutHomeConfig | false;
  className?: string;
  contentClassName?: string;
}

function resolveBusinessHomeHref(pathname: string | null): string | null {
  if (!pathname) return null;

  const match = pathname.match(/^\/business\/(\d+)(\/.*)?$/);
  if (!match || !match[2]) return null;

  return businessHomePath(match[1]);
}

export function PageLayout({
  children,
  back,
  home,
  className,
  contentClassName,
}: PageLayoutProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { translations } = useAppSelector((s) => s.user);

  const hierarchicalBackHref = useMemo(
    () => getBusinessBackHref(pathname, searchParams),
    [pathname, searchParams]
  );

  const autoHomeHref = useMemo(() => resolveBusinessHomeHref(pathname), [pathname]);

  const homeConfig =
    home === false
      ? null
      : home ?? (autoHomeHref ? { href: autoHomeHref } : null);

  const backHref =
    back?.href ?? hierarchicalBackHref ?? businessesPagePath();
  const resolvedBackHref = back?.onClick ? undefined : backHref;

  return (
    <div className={cn("space-y-6", className)}>
      {back ? (
        <div className="flex w-full flex-wrap items-center gap-2">
          <PageBackLink
            href={resolvedBackHref}
            onClick={back.onClick}
            replace={back.replace}
          >
            {back.label}
          </PageBackLink>
          {homeConfig ? (
            <PageHomeLink
              href={homeConfig.href}
              onClick={homeConfig.onClick}
              ariaLabel={homeConfig.label?.toString() ?? translations.home}
            />
          ) : null}
        </div>
      ) : null}
      <div className={cn("w-full", contentClassName)}>{children}</div>
    </div>
  );
}
