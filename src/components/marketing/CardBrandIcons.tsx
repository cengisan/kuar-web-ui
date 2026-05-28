import Image from "next/image";
import { assets } from "@/config/assets";
import { cn } from "@/lib/cn";

const brandItems = [
  { src: assets.brands.visa, alt: "Visa" },
  { src: assets.brands.mastercard, alt: "Mastercard" },
  { src: assets.brands.troy, alt: "Troy" },
  { src: assets.brands.amex, alt: "American Express" },
] as const;

export function CardBrandIcons({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)} aria-label="Accepted card brands">
      {brandItems.map((brand) => (
        <Image
          key={brand.alt}
          src={brand.src}
          alt={brand.alt}
          width={brand.src.width}
          height={brand.src.height}
          className="h-6 w-auto opacity-80"
        />
      ))}
    </div>
  );
}
