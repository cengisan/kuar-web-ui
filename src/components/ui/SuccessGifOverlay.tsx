"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { assets } from "@/config/assets";
import { cn } from "@/lib/cn";

type SuccessGifVariant = "successful" | "paymentSuccess";

export function SuccessGifOverlay({
  show,
  variant = "successful",
  className,
}: {
  show: boolean;
  variant?: SuccessGifVariant;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!show || !mounted) return null;

  const src =
    variant === "paymentSuccess" ? assets.gif.paymentSuccess : assets.gif.successful;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md",
        className
      )}
      aria-hidden
    >
      <Image
        src={src}
        alt=""
        width={src.width}
        height={src.height}
        unoptimized
        className="max-h-[min(80vh,28rem)] w-auto max-w-[min(90vw,28rem)]"
      />
    </div>,
    document.body
  );
}
