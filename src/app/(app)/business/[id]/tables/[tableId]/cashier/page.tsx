"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { Check, Minus, Plus, Receipt, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { SuccessGifOverlay } from "@/components/ui/SuccessGifOverlay";
import { CashierActionBar } from "@/components/business/CashierActionBar";
import {
  CashierPaymentDialog,
  type CashierPaymentMethod,
} from "@/components/business/CashierPaymentDialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import OrderRepositoryImpl from "@/data/repositories/OrderRepositoryImpl";
import PaymentRepositoryImpl from "@/data/repositories/PaymentRepositoryImpl";
import webSocketService from "@/services/WebSocketService";
import { useAppSelector } from "@/presentation/state/hooks";
import type { Order, OrderItem } from "@/types";
import {
  getCashierTotals,
  getItemProductName,
  getItemUnitPrice,
  getOrderItemId,
  getOrderItemPaidQuantity,
} from "@/utils/order";
import { cn } from "@/lib/cn";

interface CashierGroup {
  key: string;
  productName: string;
  unitPrice: number;
  items: OrderItem[];
  totalQty: number;
  totalPaid: number;
  totalPrice: number;
}

function getUnpaidQty(item: OrderItem) {
  return Math.max(0, (item.quantity ?? 1) - getOrderItemPaidQuantity(item));
}

function groupCashierItems(items: OrderItem[] = []): CashierGroup[] {
  const map = new Map<string, CashierGroup>();

  items
    .filter((item) => item.status !== "CANCELLED")
    .forEach((item) => {
      const unitPrice = getItemUnitPrice(item);
      const key = `${getItemProductName(item)}_${unitPrice}`;
      if (!map.has(key)) {
        map.set(key, {
          key,
          productName: getItemProductName(item),
          unitPrice,
          items: [],
          totalQty: 0,
          totalPaid: 0,
          totalPrice: 0,
        });
      }
      const group = map.get(key)!;
      group.items.push(item);
      group.totalQty += item.quantity ?? 1;
      group.totalPaid += getOrderItemPaidQuantity(item);
      group.totalPrice += item.totalPrice ?? unitPrice * (item.quantity ?? 1);
    });

  return Array.from(map.values());
}

export default function TableCashierPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ id: string; tableId: string }>();
  const businessId = Number(params.id);
  const tableId = Number(params.tableId);
  const { translations, accessToken, currency, subscriberId } = useAppSelector(
    (s) => s.user
  );

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedQuantitiesByGroup, setSelectedQuantitiesByGroup] = useState<
    Record<string, number>
  >({});
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"full" | "partial">("full");
  const [selectedMethod, setSelectedMethod] = useState<CashierPaymentMethod | null>(
    null
  );
  const [closeOpen, setCloseOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<{
    items: OrderItem[];
    maxQty: number;
    productName: string;
  } | null>(null);
  const [cancelQty, setCancelQty] = useState(1);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const loadData = useCallback(async () => {
    if (!accessToken) return;
    try {
      const orderRepo = new OrderRepositoryImpl(translations, accessToken);
      const result = await orderRepo.getActiveOrderByTable(tableId);
      setOrder(result.success && result.order ? result.order : null);
    } finally {
      setLoading(false);
    }
  }, [accessToken, tableId, translations]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!subscriberId) return;
    const handler = () => loadData();
    webSocketService.connect(subscriberId, {
      onOrderUpdate: [handler],
      onTableUpdate: [handler],
    });
    return () => {
      webSocketService.removeHandler("onOrderUpdate", handler);
      webSocketService.removeHandler("onTableUpdate", handler);
    };
  }, [subscriberId, loadData]);

  const groupedItems = useMemo(
    () => groupCashierItems(order?.items ?? []),
    [order?.items]
  );

  const { totalAmount, paidAmount, remainingAmount } = getCashierTotals(
    order,
    order?.items ?? []
  );

  const getUnpaidForGroup = (group: CashierGroup) => group.totalQty - group.totalPaid;

  const getSelectedForGroup = (group: CashierGroup) => {
    const unpaid = getUnpaidForGroup(group);
    const current = selectedQuantitiesByGroup[group.key] ?? 0;
    return Math.min(Math.max(0, current), unpaid);
  };

  const unpaidGroups = groupedItems.filter((g) => getUnpaidForGroup(g) > 0);
  const totalUnpaidUnits = unpaidGroups.reduce(
    (sum, g) => sum + getUnpaidForGroup(g),
    0
  );
  const allUnpaidSelected =
    unpaidGroups.length > 0 &&
    unpaidGroups.every((g) => getSelectedForGroup(g) === getUnpaidForGroup(g));

  const selectedTotal = unpaidGroups.reduce((sum, g) => {
    const qty = getSelectedForGroup(g);
    return sum + (g.unitPrice || 0) * qty;
  }, 0);
  const selectedCount = unpaidGroups.reduce(
    (sum, g) => sum + getSelectedForGroup(g),
    0
  );

  const setGroupPayQuantity = (groupKey: string, quantity: number) => {
    setSelectedQuantitiesByGroup((prev) => {
      const next = { ...prev };
      if (quantity <= 0) delete next[groupKey];
      else next[groupKey] = quantity;
      return next;
    });
  };

  const handleSelectAll = () => {
    if (allUnpaidSelected) {
      setSelectedQuantitiesByGroup({});
      return;
    }
    const next: Record<string, number> = {};
    unpaidGroups.forEach((g) => {
      next[g.key] = getUnpaidForGroup(g);
    });
    setSelectedQuantitiesByGroup(next);
  };

  const openPaymentModal = (mode: "full" | "partial") => {
    if (mode === "partial" && selectedCount === 0) {
      toast.info(translations.selectItemsToPay);
      return;
    }
    setPaymentMode(mode);
    setSelectedMethod(null);
    setPaymentOpen(true);
  };

  const handleProcessPayment = async () => {
    if (!selectedMethod || !order) return;
    setActionLoading(true);
    setPaymentOpen(false);

    try {
      const paymentRepo = new PaymentRepositoryImpl(translations, accessToken);
      let result;

      if (paymentMode === "partial") {
        const itemsWithQuantity: { itemId: number; quantity: number }[] = [];
        unpaidGroups.forEach((group) => {
          let toPay = getSelectedForGroup(group);
          if (toPay <= 0) return;
          group.items.forEach((item) => {
            const unpaid = getUnpaidQty(item);
            const pay = Math.min(unpaid, toPay);
            if (pay > 0) {
              const itemId = getOrderItemId(item);
              if (itemId) {
                itemsWithQuantity.push({ itemId, quantity: pay });
              }
              toPay -= pay;
            }
          });
        });
        result = await paymentRepo.processPartialPayment(
          order.id,
          itemsWithQuantity,
          selectedMethod
        );
      } else {
        result = await paymentRepo.processFullPayment(order.id, selectedMethod);
      }

      if (result.success) {
        setSelectedQuantitiesByGroup({});
        await loadData();
        toast.success(translations.success);
      } else {
        toast.error(result.message || translations.paymentFailed);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelItem = async () => {
    if (!cancelTarget || !order) return;
    let unitsToCancel = cancelQty;
    setCancelTarget(null);
    setActionLoading(true);

    try {
      const orderRepo = new OrderRepositoryImpl(translations, accessToken);
      let lastSuccess = false;

      for (const item of cancelTarget.items) {
        if (unitsToCancel <= 0) break;
        const itemQty = item.quantity ?? 1;
        const itemId = getOrderItemId(item);
        if (!itemId) continue;
        const result = await orderRepo.removeItemFromOrder(order.id, itemId);
        if (!result.success) break;
        lastSuccess = true;
        if (unitsToCancel < itemQty) {
          await orderRepo.addItemToOrder(order.id, {
            productId: item.productId ?? item.product_id,
            quantity: itemQty - unitsToCancel,
          });
          unitsToCancel = 0;
        } else {
          unitsToCancel -= itemQty;
        }
      }

      if (lastSuccess) {
        await loadData();
      } else {
        toast.error(translations.error);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseOrder = async () => {
    if (!order) return;
    setActionLoading(true);
    setCloseOpen(false);

    try {
      const paymentRepo = new PaymentRepositoryImpl(translations, accessToken);
      const result = await paymentRepo.closeOrder(order.id);
      if (result.success) {
        setShowSuccessOverlay(true);
        window.setTimeout(() => {
          setShowSuccessOverlay(false);
          router.replace(`/business/${businessId}/areas?mode=cashier`);
        }, 2000);
      } else {
        toast.error(result.message || translations.closeFailed);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const tableNumber = order?.tableNumber || order?.table_number || String(tableId);

  const handleBack = () => {
    const areaId = searchParams.get("areaId");
    if (areaId) {
      router.push(
        `/business/${businessId}/areas/${areaId}/tables?mode=cashier`
      );
      return;
    }
    router.push(`/business/${businessId}/areas?mode=cashier`);
  };

  const paymentAmount = paymentMode === "partial" ? selectedTotal : remainingAmount;
  const paymentDescription =
    paymentMode === "partial"
      ? `${selectedCount} ${translations.items}`
      : `${translations.total}: ${remainingAmount.toFixed(2)} ${currency}`;

  if (loading) {
    return (
      <PageLayout
        back={{ label: translations.back, onClick: handleBack }}
      >
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      </PageLayout>
    );
  }

  if (!order) {
    return (
      <PageLayout
        back={{ label: translations.back, onClick: handleBack }}
        contentClassName="space-y-6"
      >
        <Card>
          <CardContent className="space-y-4 p-12 text-center">
            <Receipt className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              {translations.noActiveOrder}
            </p>
          </CardContent>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      back={{ label: translations.back, onClick: handleBack }}
      contentClassName="space-y-4"
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">
          {translations.cashier} — {translations.table}{" "}
          {tableNumber}
        </h1>
        {order.orderNumber && (
          <p className="text-sm text-muted-foreground">#{order.orderNumber}</p>
        )}
      </div>

      <Card>
        <CardContent className="space-y-2 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{translations.total}</span>
            <span className="font-semibold">
              {totalAmount.toFixed(2)} {currency}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-primary">{translations.paid}</span>
            <span className="font-semibold text-primary">
              {paidAmount.toFixed(2)} {currency}
            </span>
          </div>
          <div className="flex justify-between border-t border-border pt-2">
            <span className="font-semibold">{translations.remaining}</span>
            <span
              className={cn(
                "text-xl font-bold",
                remainingAmount > 0 ? "text-amber-500" : "text-primary"
              )}
            >
              {remainingAmount.toFixed(2)} {currency}
            </span>
          </div>
        </CardContent>
      </Card>

      {unpaidGroups.length > 0 && (
        <label className="flex cursor-pointer items-center gap-2 px-1">
          <Checkbox checked={allUnpaidSelected} onCheckedChange={handleSelectAll} />
          <span className="text-sm text-muted-foreground">
            {translations.selectAll} ({totalUnpaidUnits})
          </span>
        </label>
      )}

      <div className="space-y-3">
        {groupedItems.map((group) => {
          const unpaid = getUnpaidForGroup(group);
          const isFullyPaid = unpaid <= 0;
          const selectedQty = getSelectedForGroup(group);
          const unpaidItems = group.items.filter((i) => getUnpaidQty(i) > 0);
          const totalUnpaidUnitsInGroup = unpaidItems.reduce(
            (s, i) => s + getUnpaidQty(i),
            0
          );

          return (
            <Card
              key={group.key}
              className={cn(
                selectedQty > 0 && "border-primary",
                isFullyPaid && "border-primary/30 bg-primary/5"
              )}
            >
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "font-bold",
                        isFullyPaid && "text-muted-foreground"
                      )}
                    >
                      {group.productName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {group.totalQty}× {group.unitPrice.toFixed(2)} {currency}
                    </p>
                    {group.totalPaid > 0 && (
                      <p className="text-xs text-primary">
                        {group.totalPaid}/{group.totalQty}{" "}
                        {translations.paid}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isFullyPaid && <Check className="h-5 w-5 text-primary" />}
                    {!isFullyPaid && totalUnpaidUnitsInGroup > 0 && (
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 shrink-0 border-destructive text-destructive"
                        onClick={() => {
                          setCancelTarget({
                            items: unpaidItems,
                            maxQty: totalUnpaidUnitsInGroup,
                            productName: group.productName,
                          });
                          setCancelQty(1);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {!isFullyPaid && unpaid > 0 ? (
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        disabled={selectedQty <= 0}
                        onClick={() =>
                          setGroupPayQuantity(group.key, selectedQty - 1)
                        }
                      >
                        <Minus />
                      </Button>
                      <span className="min-w-8 text-center font-bold">
                        {selectedQty}
                      </span>
                      <Button
                        size="icon"
                        onClick={() =>
                          setGroupPayQuantity(
                            group.key,
                            Math.min(unpaid, selectedQty + 1)
                          )
                        }
                        disabled={selectedQty >= unpaid}
                      >
                        <Plus />
                      </Button>
                    </div>
                  ) : (
                    <span />
                  )}
                  <p
                    className={cn(
                      "font-bold",
                      isFullyPaid ? "text-muted-foreground" : "text-primary"
                    )}
                  >
                    {group.totalPrice.toFixed(2)} {currency}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <CashierActionBar
        translations={translations}
        currency={currency}
        remainingAmount={remainingAmount}
        selectedCount={selectedCount}
        selectedTotal={selectedTotal}
        actionLoading={actionLoading}
        onPayAll={() => openPaymentModal("full")}
        onPaySelected={() => openPaymentModal("partial")}
        onCloseOrder={() => {
          if (remainingAmount > 0) {
            toast.info(
              translations.payBeforeCloseHint
            );
            return;
          }
          setCloseOpen(true);
        }}
      />

      <CashierPaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        translations={translations}
        currency={currency}
        amount={paymentAmount}
        description={paymentDescription}
        selectedMethod={selectedMethod}
        onSelectMethod={setSelectedMethod}
        onConfirm={handleProcessPayment}
        loading={actionLoading}
      />

      <Dialog open={closeOpen} onOpenChange={setCloseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{translations.closeOrder}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {translations.closeOrderConfirmation}
          </p>
          <div className="rounded-lg bg-muted/40 p-3 text-sm space-y-1">
            <p>
              {translations.table}: {tableNumber}
            </p>
            <p>
              {translations.orderNumber}: #{order.orderNumber}
            </p>
            <p>
              {translations.total}: {totalAmount.toFixed(2)} {currency}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseOpen(false)}>
              {translations.cancel}
            </Button>
            <Button onClick={handleCloseOrder} loading={actionLoading}>
              {translations.confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!cancelTarget} onOpenChange={(o) => !o && setCancelTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{translations.cancelItem}</DialogTitle>
          </DialogHeader>
          <p className="text-center text-sm text-muted-foreground">
            {cancelTarget?.productName} — max {cancelTarget?.maxQty}
          </p>
          <div className="flex items-center justify-center gap-4 py-4">
            <Button
              size="icon"
              variant="destructive"
              onClick={() => setCancelQty((q) => Math.max(1, q - 1))}
            >
              <Minus />
            </Button>
            <span className="text-3xl font-bold">{cancelQty}</span>
            <Button
              size="icon"
              onClick={() =>
                setCancelQty((q) =>
                  Math.min(cancelTarget?.maxQty ?? 1, q + 1)
                )
              }
            >
              <Plus />
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelTarget(null)}>
              {translations.cancel}
            </Button>
            <Button variant="destructive" onClick={handleCancelItem} loading={actionLoading}>
              {cancelQty} {translations.cancel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SuccessGifOverlay show={showSuccessOverlay} />
    </PageLayout>
  );
}
