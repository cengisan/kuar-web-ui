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
        className="flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: `${waitColor}20` }}
      >
        <div>
          <p className="text-lg font-bold">
            {translations.table} {order.tableNumber || order.table_number}
          </p>
          {order.areaName && (
            <p className="text-xs text-muted-foreground">{order.areaName}</p>
          )}
        </div>
        <div className="text-right">
          <div
            className="flex items-center justify-end gap-1 text-lg font-bold"
            style={{ color: waitColor }}
          >
            <Clock className="h-4 w-4" />
            {formatWaitTime(elapsedSeconds)}
          </div>
          {order.orderNumber && (
            <p className="text-xs text-muted-foreground">#{order.orderNumber}</p>
          )}
        </div>
      </div>

      <div className="divide-y divide-border px-4 py-2">
        {items.map((item) => {
          const itemId = getOrderItemId(item);
          const itemKey =
            itemId ?? `${getItemProductName(item)}-${item.status}`;
          const isPending = item.status === "PENDING";
          const isUpdating = itemId != null && updatingItemId === itemId;

          return (
            <div
              key={itemKey}
              className="flex items-center gap-3 py-2 first:pt-0 last:pb-0"
            >
              <div className="min-w-0 flex-1">
                <p className="text-base font-bold">
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
                className="shrink-0 font-bold text-white"
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
