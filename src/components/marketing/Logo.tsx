"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { assets } from "@/config/assets";
import { useAppSelector } from "@/presentation/state/hooks";

const heightClass = { sm: "h-7", md: "h-9", lg: "h-12" } as const;

export function Logo({
  className,
  href = "/",
  showText = false,
  size = "md",
}: {
  className?: string;
  href?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const theme = useAppSelector((s) => s.user.theme);
  const logo = theme === "light" ? assets.logo.light : assets.logo.dark;
  const textSize = { sm: "text-base", md: "text-xl", lg: "text-2xl" }[size];

  const mark = (
    <Image
      src={logo}
      alt="Kuar"
      width={logo.width}
      height={logo.height}
      className={cn("w-auto", heightClass[size])}
      priority={size === "lg"}
    />
  );

  const content = (
    <span className={cn("inline-flex items-center gap-2.5 font-bold tracking-tight", className)}>
      {mark}
      {showText && <span className={textSize}>Kuar</span>}
    </span>
  );

  if (href) {
    const handleHomeClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (
        href === "/" &&
        window.location.pathname === "/" &&
        window.location.hash.length > 0
      ) {
        event.preventDefault();
        window.history.replaceState(null, "", "/");
      }
    };

    return (
      <Link
        href={href}
        onClick={handleHomeClick}
        className="inline-flex transition-opacity hover:opacity-90"
      >
        {content}
      </Link>
    );
  }

  return content;
}
