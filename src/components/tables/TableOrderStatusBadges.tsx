import { CheckCheck, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/cn";
import type { CafeTable } from "@/types";

interface TableOrderStatusBadgesProps {
  table: CafeTable;
  className?: string;
}

function getOrderCounts(table: CafeTable) {
  const pendingCount = table.pendingCount ?? 0;
  const preparingCount = table.preparingCount ?? 0;
  const readyCount = table.readyCount ?? 0;
  const deliveredCount = table.deliveredCount ?? 0;
  const waitingCount = pendingCount + preparingCount;

  return { waitingCount, readyCount, deliveredCount };
}

export function TableOrderStatusBadges({ table, className }: TableOrderStatusBadgesProps) {
  if (table.status !== "OCCUPIED") {
    return <div className={cn("h-7", className)} aria-hidden />;
  }

  const { waitingCount, readyCount, deliveredCount } = getOrderCounts(table);
  const hasCounts = waitingCount + readyCount + deliveredCount > 0;

  return (
    <div
      className={cn(
        "flex h-7 items-center justify-center",
        className
      )}
    >
      {hasCounts ? (
        <div className="inline-flex items-center gap-2 rounded-lg bg-muted px-2 py-1">
          {waitingCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-red-500">
              <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {waitingCount}
            </span>
          )}
          {readyCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FFD700]">
              <CheckCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {readyCount}
            </span>
          )}
          {deliveredCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500">
              <CheckCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {deliveredCount}
            </span>
          )}
        </div>
      ) : null}
    </div>
  );
}
