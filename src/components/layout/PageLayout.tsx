"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { PageBackLink } from "@/components/layout/PageBackLink";
import { PageHomeLink } from "@/components/layout/PageHomeLink";
import { useAppSelector } from "@/presentation/state/hooks";

export interface PageLayoutBackConfig {
  label: React.ReactNode;
  href?: string;
  onClick?: () => void;
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

  return `/business/${match[1]}`;
}

export function PageLayout({
  children,
  back,
  home,
  className,
  contentClassName,
}: PageLayoutProps) {
  const pathname = usePathname();
  const { translations } = useAppSelector((s) => s.user);

  const autoHomeHref = useMemo(() => resolveBusinessHomeHref(pathname), [pathname]);

  const homeConfig =
    home === false
      ? null
      : home ?? (autoHomeHref ? { href: autoHomeHref, label: translations.home } : null);

  return (
    <div className={cn("space-y-6", className)}>
      {back ? (
        <div className="flex w-full flex-wrap items-center gap-2">
          <PageBackLink href={back.href} onClick={back.onClick}>
            {back.label}
          </PageBackLink>
          {homeConfig ? (
            <PageHomeLink href={homeConfig.href} onClick={homeConfig.onClick}>
              {homeConfig.label ?? translations.home}
            </PageHomeLink>
          ) : null}
        </div>
      ) : null}
      <div className={cn("w-full", contentClassName)}>{children}</div>
    </div>
  );
}
