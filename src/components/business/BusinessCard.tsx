import Link from "next/link";
import { Building2, ChevronRight } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import type { Business } from "@/types";

export function BusinessCard({ business }: { business: Business }) {
  const businessId = business.business_id ?? business.id;

  return (
    <Link href={`/business/${businessId}`} aria-label={business.name} className="group block">
      <Card className="overflow-hidden border-border/80 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-card">
        <CardHeader className="flex flex-row items-center gap-4 p-5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-primary/5 ring-1 ring-primary/20">
            <Building2 className="size-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold leading-tight tracking-tight transition-colors group-hover:text-primary">
              {business.name}
            </h3>
            {business.description && (
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {business.description}
              </p>
            )}
          </div>
          <ChevronRight
            className="size-5 shrink-0 text-muted-foreground transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
            aria-hidden="true"
          />
        </CardHeader>
      </Card>
    </Link>
  );
}
