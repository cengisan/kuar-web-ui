"use client";

import { cn } from "@/lib/cn";
import { PageBackLink } from "@/components/layout/PageBackLink";

export interface PageLayoutBackConfig {
  label: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface PageLayoutProps {
  children: React.ReactNode;
  back?: PageLayoutBackConfig;
  className?: string;
  contentClassName?: string;
}

export function PageLayout({
  children,
  back,
  className,
  contentClassName,
}: PageLayoutProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {back ? (
        <div className="flex w-full items-center">
          <PageBackLink href={back.href} onClick={back.onClick}>
            {back.label}
          </PageBackLink>
        </div>
      ) : null}
      <div className={cn("w-full", contentClassName)}>{children}</div>
    </div>
  );
}
