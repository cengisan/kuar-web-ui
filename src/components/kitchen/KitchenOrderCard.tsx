"use client";

import { memo, useEffect, useState } from "react";
import { Clock, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Order, OrderItem, Translations } from "@/types";
import { getItemProductName, getOrderItemId } from "@/utils/order";
import { formatWaitTime, getWaitTimeColor } from "@/utils/kitchen";

interface KitchenOrderCardProps {
  order: Order;
  translations: Translations;
  updatingItemId: number | null;
  onUpdateItemStatus: (item: OrderItem) => void;
}

export const KitchenOrderCard = memo(function KitchenOrderCard({
  order,
  translations,
  updatingItemId,
  onUpdateItemStatus,
}: KitchenOrderCardProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(
    order.waitTimeSeconds ?? 0
  );

  useEffect(() => {
    setElapsedSeconds(order.waitTimeSeconds ?? 0);
  }, [order.waitTimeSeconds]);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const waitColor = getWaitTimeColor(elapsedSeconds);
  const items = order.items ?? [];

  return (
    <div
      className="overflow-hidden rounded-2xl border-2 bg-card"
      style={{ borderColor: waitColor }}
    >
      <div
        className="flex items-start justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3"
        style={{ backgroundColor: `${waitColor}20` }}
      >
        <div className="min-w-0">
          <p className="truncate text-base font-bold sm:text-lg">
            {translations.table} {order.tableNumber || order.table_number}
          </p>
          {order.areaName && (
            <p className="truncate text-xs text-muted-foreground">
              {order.areaName}
            </p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <div
            className="flex items-center justify-end gap-1 text-base font-bold sm:text-lg"
            style={{ color: waitColor }}
          >
            <Clock className="h-4 w-4" />
            {formatWaitTime(elapsedSeconds)}
          </div>
          {order.orderNumber && (
            <p className="truncate text-xs text-muted-foreground">
              #{order.orderNumber}
            </p>
          )}
        </div>
      </div>

      <div className="divide-y divide-border px-3 py-2 sm:px-4">
        {items.map((item) => {
          const itemId = getOrderItemId(item);
          const itemKey =
            itemId ?? `${getItemProductName(item)}-${item.status}`;
          const isPending = item.status === "PENDING";
          const isUpdating = itemId != null && updatingItemId === itemId;

          return (
            <div
              key={itemKey}
              className="flex flex-col gap-2 py-2 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:gap-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold sm:text-base">
                  {item.quantity}× {getItemProductName(item)}
                </p>
                {item.note && (
                  <p className="mt-1 text-sm italic text-[#FFB020]">
                    ⚠️ {item.note}
                  </p>
                )}
              </div>
              <Button
                size="sm"
                disabled={isUpdating}
                className="w-full shrink-0 font-bold text-white sm:w-auto"
                style={{
                  backgroundColor: isPending ? "#FFB020" : "#22c55e",
                }}
                onClick={() => onUpdateItemStatus(item)}
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isPending ? (
                  translations.startPreparing
                ) : (
                  translations.markReady
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
});
