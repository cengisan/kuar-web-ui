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
    "inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-primary transition-colors hover:bg-muted/70 hover:text-primary",
    className
  );

  const icon = <Building2 className="size-5" aria-hidden />;

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
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
