"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { KitchenOrderCard } from "@/components/kitchen/KitchenOrderCard";
import { ChefHat, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import OrderRepositoryImpl from "@/data/repositories/OrderRepositoryImpl";
import webSocketService from "@/services/WebSocketService";
import { useAppSelector } from "@/presentation/state/hooks";
import type { Order, OrderItem } from "@/types";
import { getOrderItemId } from "@/utils/order";

export default function KitchenPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const businessId = Number(params.id);
  const { translations, accessToken, subscriberId } = useAppSelector((s) => s.user);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);

  const loadOrders = useCallback(async () => {
    if (!accessToken) return;
    try {
      const repo = new OrderRepositoryImpl(translations, accessToken);
      const r = await repo.getKitchenOrdersByBusiness(businessId);
      if (r.success) {
        setOrders(r.orders || []);
      } else {
        setOrders([]);
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, businessId, translations]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    if (!subscriberId) return;
    const handler = () => loadOrders();
    webSocketService.connect(subscriberId, {
      onKitchenUpdate: [handler],
      onOrderUpdate: [handler],
    });
    const checkInterval = setInterval(
      () => setConnected(webSocketService.getIsConnected()),
      2000
    );
    return () => {
      webSocketService.removeHandler("onKitchenUpdate", handler);
      webSocketService.removeHandler("onOrderUpdate", handler);
      clearInterval(checkInterval);
    };
  }, [subscriberId, loadOrders]);

  const updateItemStatus = async (item: OrderItem) => {
    if (!accessToken) return;
    const itemId = getOrderItemId(item);
    if (!itemId) {
      toast.error(translations.updateFailed);
      return;
    }
    const newStatus = item.status === "PENDING" ? "PREPARING" : "READY";
    setUpdatingItemId(itemId);
    try {
      const repo = new OrderRepositoryImpl(translations, accessToken);
      const r = await repo.updateItemStatus(itemId, newStatus);
      if (r.success) {
        toast.success(
          newStatus === "PREPARING"
            ? translations.startPreparing
            : translations.itemReady
        );
        loadOrders();
      } else {
        toast.error(r.message);
      }
    } finally {
      setUpdatingItemId(null);
    }
  };

  const pendingItemCount = orders.reduce(
    (sum, order) => sum + (order.items?.length ?? 0),
    0
  );

  return (
    <PageLayout
      back={{ label: translations.back, onClick: () => router.back() }}
      contentClassName="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{translations.kitchenDisplay}</h1>
        <div className="flex items-center gap-3">
          <Badge variant={connected ? "success" : "secondary"}>
            {connected ? (
              <>
                <Wifi className="h-3 w-3" />
                {translations.connected}
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3" />
                {translations.disconnected}
              </>
            )}
          </Badge>
          <Button size="icon" variant="outline" onClick={loadOrders}>
            <RefreshCw />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 rounded-xl border border-border bg-card py-3">
        <div className="text-center">
          <p className="text-2xl font-bold">{orders.length}</p>
          <p className="text-xs text-muted-foreground">
            {translations.activeOrders}
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{pendingItemCount}</p>
          <p className="text-xs text-muted-foreground">
            {translations.pendingItems}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <ChefHat className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold">
            {translations.noKitchenOrders}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {translations.kitchenRelaxMessage}
          </p>
        </div>
      ) : (
        <div className="grid w-full grid-cols-1 gap-3 pb-8 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <KitchenOrderCard
              key={order.id}
              order={order}
              translations={translations}
              updatingItemId={updatingItemId}
              onUpdateItemStatus={updateItemStatus}
            />
          ))}
        </div>
      )}
    </PageLayout>
  );
}
