"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/cn";

export function PageBackLink({
  href,
  onClick,
  children,
  className,
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const classes = cn(
    "inline-flex min-h-10 items-center gap-2.5 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        <ArrowLeft className="size-4" />
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      <ArrowLeft className="size-4" />
      {children}
    </button>
  );
}
