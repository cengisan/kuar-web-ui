"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { Minus, Plus, CheckCheck, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { SuccessGifOverlay } from "@/components/ui/SuccessGifOverlay";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import OrderRepositoryImpl from "@/data/repositories/OrderRepositoryImpl";
import webSocketService from "@/services/WebSocketService";
import { useAppSelector } from "@/presentation/state/hooks";
import type { Order, OrderItem } from "@/types";
import {
  getGroupedStatusOrder,
  getItemDeliveredQuantity,
  getItemRemaining,
  getItemUnitPrice,
  getOrderTotal,
  groupOrderItems,
  isOrderFullyDelivered,
  type GroupedOrderItem,
} from "@/utils/order";
import { cn } from "@/lib/cn";
import { useKitchenModuleAccess } from "@/hooks/useKitchenModuleAccess";

const DELIVERABLE_WITH_KITCHEN = ["READY"];
const DELIVERABLE_WITHOUT_KITCHEN = ["PENDING", "PREPARING", "READY"];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-amber-500 bg-amber-500/15 border-amber-500/30",
  PREPARING: "text-blue-500 bg-blue-500/15 border-blue-500/30",
  READY: "text-emerald-500 bg-emerald-500/15 border-emerald-500/30",
  DELIVERED: "text-emerald-500 bg-emerald-500/15 border-emerald-500/30",
  CANCELLED: "text-red-500 bg-red-500/15 border-red-500/30",
};

export default function TableOrderPage() {
  const router = useRouter();
  const params = useParams<{ id: string; tableId: string }>();
  const businessId = Number(params.id);
  const tableId = Number(params.tableId);
  const { translations, accessToken, currency, subscriberId } = useAppSelector(
    (s) => s.user
  );
  const { hasKitchenModule, isLoading: isKitchenAccessLoading } =
    useKitchenModuleAccess();

  const effectiveHasKitchen = isKitchenAccessLoading || hasKitchenModule;
  const deliverableStatuses = effectiveHasKitchen
    ? DELIVERABLE_WITH_KITCHEN
    : DELIVERABLE_WITHOUT_KITCHEN;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [deliverQuantitiesByGroup, setDeliverQuantitiesByGroup] = useState<
    Record<string, number>
  >({});

  const loadOrder = useCallback(async () => {
    if (!accessToken) return;
    try {
      const repo = new OrderRepositoryImpl(translations, accessToken);
      const result = await repo.getActiveOrderByTable(tableId);
      setOrder(result.success && result.order ? result.order : null);
    } finally {
      setLoading(false);
    }
  }, [accessToken, tableId, translations]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  useEffect(() => {
    if (!subscriberId) return;
    const handler = () => {
      loadOrder();
    };
    webSocketService.connect(subscriberId, {
      onOrderUpdate: [handler],
      onKitchenUpdate: [handler],
    });
    return () => {
      webSocketService.removeHandler("onOrderUpdate", handler);
      webSocketService.removeHandler("onKitchenUpdate", handler);
    };
  }, [subscriberId, loadOrder]);

  const groupedItems = useMemo(
    () => groupOrderItems(order?.items ?? []),
    [order?.items]
  );

  const fullyDelivered = isOrderFullyDelivered(order?.items ?? []);
  const effectiveStatus = fullyDelivered ? "DELIVERED" : order?.status ?? "";

  const statusLabel = (status: string) => {
    const map: Record<string, string | undefined> = {
      PENDING: translations.pending,
      PREPARING: translations.preparing,
      READY: translations.ready,
      DELIVERED: translations.delivered,
      CANCELLED: translations.cancelled,
    };
    return map[status] || status;
  };

  const getDeliverableItemsForGroup = useCallback(
    (group: GroupedOrderItem): OrderItem[] => {
      const items: OrderItem[] = [];
      deliverableStatuses.forEach((status) => {
        const list = group.statuses[status]?.items ?? [];
        list.forEach((item) => {
          if (getItemRemaining(item) > 0) items.push(item);
        });
      });
      return items;
    },
    [deliverableStatuses]
  );

  const getDeliverableRemainingForGroup = (group: GroupedOrderItem) =>
    getDeliverableItemsForGroup(group).reduce(
      (sum, item) => sum + getItemRemaining(item),
      0
    );

  const getDeliverQtyForGroup = (group: GroupedOrderItem) => {
    const deliverableRem = getDeliverableRemainingForGroup(group);
    if (deliverableRem <= 0) return 0;
    if (!Object.prototype.hasOwnProperty.call(deliverQuantitiesByGroup, group.key)) {
      return deliverableRem;
    }
    const stored = deliverQuantitiesByGroup[group.key];
    return Math.max(0, Math.min(Number(stored) || 0, deliverableRem));
  };

  const setGroupDeliverQty = (groupKey: string, value: number) => {
    setDeliverQuantitiesByGroup((prev) => ({ ...prev, [groupKey]: value }));
  };

  const totalDeliverCount = groupedItems
    .filter((group) => getDeliverableRemainingForGroup(group) > 0)
    .reduce((sum, group) => sum + getDeliverQtyForGroup(group), 0);

  const hasAnyDeliverableItem = groupedItems.some(
    (group) => getDeliverableRemainingForGroup(group) > 0
  );

  const handleDeliver = async () => {
    if (!order) return;
    const toDeliver: { item: OrderItem; qty: number }[] = [];

    groupedItems.forEach((group) => {
      let remainingForGroup = getDeliverQtyForGroup(group);
      if (remainingForGroup <= 0) return;
      getDeliverableItemsForGroup(group).forEach((item) => {
        const remaining = getItemRemaining(item);
        const pay = Math.min(remaining, remainingForGroup);
        if (pay > 0) {
          toDeliver.push({ item, qty: pay });
          remainingForGroup -= pay;
        }
      });
    });

    if (toDeliver.length === 0) return;

    setActionLoading(true);
    try {
      const repo = new OrderRepositoryImpl(translations, accessToken);
      await Promise.all(
        toDeliver.map(({ item, qty }) =>
          repo.updateItemStatus(
            item.id,
            "DELIVERED",
            getItemDeliveredQuantity(item) + qty
          )
        )
      );
      await loadOrder();
      setDeliverQuantitiesByGroup({});
      setShowSuccessOverlay(true);
      window.setTimeout(() => setShowSuccessOverlay(false), 1800);
      toast.success(translations.delivered || translations.orderSent);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order || !accessToken) return;
    setActionLoading(true);
    try {
      const repo = new OrderRepositoryImpl(translations, accessToken);
      const result = await repo.cancelOrder(order.id);
      if (result.success) {
        toast.success(translations.orderCancelled);
        setCancelOpen(false);
        router.back();
      } else {
        toast.error(result.message);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const productsHref = order
    ? `/business/${businessId}/tables/${tableId}/order/products?orderId=${order.id}`
    : `/business/${businessId}/tables/${tableId}/order/products`;

  if (loading) {
    return (
      <PageLayout
        back={{ label: translations.back, onClick: () => router.back() }}
      >
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      back={{ label: translations.back, onClick: () => router.back() }}
      contentClassName="space-y-4 pb-36"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">
            {translations.table}{" "}
            {order?.tableNumber || order?.table_number || tableId}
          </h1>
          {order?.orderNumber && (
            <p className="text-sm text-muted-foreground">#{order.orderNumber}</p>
          )}
        </div>
        {order ? (
          <Button variant="outline" size="sm" onClick={() => setCancelOpen(true)}>
            {translations.cancelOrder}
          </Button>
        ) : null}
      </div>

      {order && (
        <div
          className={cn(
            "rounded-xl border px-4 py-3",
            STATUS_COLORS[effectiveStatus] || "border-border bg-card/50"
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="font-medium">{statusLabel(effectiveStatus)}</p>
            {order.waiterName && (
              <p className="text-sm text-muted-foreground">
                {translations.waiter}: {order.waiterName}
              </p>
            )}
          </div>
        </div>
      )}

      {!order?.items?.length ? (
        <Card>
          <CardContent className="space-y-4 p-12 text-center">
            <UtensilsCrossed className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              {translations.noItemsInOrder || translations.noActiveOrder}
            </p>
            <Button asChild>
              <Link href={productsHref}>
                {translations.addProducts || translations.addItem}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {groupedItems.map((group) => {
            const deliverableRem = getDeliverableRemainingForGroup(group);
            const toDeliverQty = getDeliverQtyForGroup(group);

            return (
              <Card key={group.key}>
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-lg font-bold">{group.productName}</p>
                    <p className="shrink-0 text-lg font-bold text-primary">
                      {group.totalPrice.toFixed(2)} {currency}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {getGroupedStatusOrder()
                      .filter((status) => (group.statuses[status]?.qty ?? 0) > 0)
                      .map((status) => (
                        <div
                          key={status}
                          className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0 last:pb-0"
                        >
                          <span className="text-sm text-muted-foreground">
                            {group.statuses[status]?.qty ?? 0} ×{" "}
                            {getItemUnitPrice(group.allItems[0]).toFixed(2)} {currency}
                          </span>
                          <Badge variant="secondary">{statusLabel(status)}</Badge>
                        </div>
                      ))}
                  </div>

                  {deliverableRem > 0 && !fullyDelivered && (
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        disabled={actionLoading || toDeliverQty <= 0}
                        onClick={() =>
                          setGroupDeliverQty(group.key, Math.max(0, toDeliverQty - 1))
                        }
                      >
                        <Minus />
                      </Button>
                      <span className="min-w-8 text-center font-bold">{toDeliverQty}</span>
                      <Button
                        size="icon"
                        onClick={() =>
                          setGroupDeliverQty(
                            group.key,
                            Math.min(deliverableRem, toDeliverQty + 1)
                          )
                        }
                        disabled={actionLoading || toDeliverQty >= deliverableRem}
                      >
                        <Plus />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {order?.items?.length ? (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 p-4 backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-lg text-muted-foreground">
              {translations.total}
            </p>
            <p className="text-2xl font-bold text-primary">
              {getOrderTotal(order).toFixed(2)} {currency}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <Button asChild variant="outline" className="flex-1">
              <Link href={productsHref}>
                <Plus />
                {translations.addMore || translations.addItem}
              </Link>
            </Button>
            {!fullyDelivered && hasAnyDeliverableItem && (
              totalDeliverCount > 0 ? (
                <Button
                  className="flex-1 sm:col-span-2"
                  loading={actionLoading}
                  onClick={handleDeliver}
                >
                  <CheckCheck />
                  {translations.deliverSelected} ({totalDeliverCount})
                </Button>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-primary/45 px-3 py-3 sm:col-span-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-primary-foreground">
                    <CheckCheck className="h-4 w-4" />
                    {translations.deliverSelected} (0)
                  </div>
                  <p className="mt-1 text-center text-xs text-primary-foreground/90">
                    {effectiveHasKitchen
                      ? translations.deliverPickQty
                      : translations.deliverPickQtyNoKitchen}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      ) : null}

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {translations.confirmCancelOrder}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {translations.cancelOrderWarning}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)}>
              {translations.no || translations.cancel}
            </Button>
            <Button variant="destructive" loading={actionLoading} onClick={handleCancelOrder}>
              {translations.yes || translations.confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SuccessGifOverlay show={showSuccessOverlay} />
    </PageLayout>
  );
}
