"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/cn";

export function PageHomeLink({
  href,
  onClick,
  ariaLabel,
  className,
}: {
  href?: string;
  onClick?: () => void;
  ariaLabel: string;
  className?: string;
}) {
  const classes = cn(
    "inline-flex min-h-10 items-center justify-center rounded-full px-3 py-2 text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground",
    className
  );

  const icon = <Building2 className="size-4" aria-hidden />;

  if (href) {
    return (
      <Link href={href} replace className={classes} aria-label={ariaLabel}>
        {icon}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes} aria-label={ariaLabel}>
      {icon}
    </button>
  );
}
