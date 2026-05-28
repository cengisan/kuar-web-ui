"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { Check, ChefHat, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import OrderRepositoryImpl from "@/data/repositories/OrderRepositoryImpl";
import webSocketService from "@/services/WebSocketService";
import { useAppSelector } from "@/presentation/state/hooks";
import type { Order, OrderItem } from "@/types";
import { getItemProductName, getOrderItemId } from "@/utils/order";

export default function KitchenPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const businessId = Number(params.id);
  const { translations, accessToken, subscriberId } = useAppSelector((s) => s.user);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

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
  };

  return (
    <PageLayout
      back={{ label: translations.back, onClick: () => router.back() }}
      contentClassName="space-y-6"
    ><div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {translations.kitchenDisplay}
        </h1>
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

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <ChefHat className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold">
            {translations.noOrders}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => {
            const pending = (order.items || []).filter(
              (i) => i.status !== "READY" && i.status !== "DELIVERED"
            );
            return (
              <Card key={order.id} className="border-orange-500/40">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <p className="font-bold">
                      {translations.table} #
                      {order.tableNumber || order.table_number || order.table_id}
                    </p>
                    <Badge variant="warning">{pending.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {pending.map((item) => {
                    const itemKey = getOrderItemId(item) ?? `${getItemProductName(item)}-${item.status}`;
                    const isPending = item.status === "PENDING";
                    return (
                    <div
                      key={itemKey}
                      className="flex items-center justify-between rounded-lg bg-muted/40 p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">
                          {item.quantity}× {getItemProductName(item)}
                        </p>
                        {item.note && (
                          <p className="truncate text-xs text-muted-foreground">
                            {item.note}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant={isPending ? "default" : "outline"}
                        onClick={() => updateItemStatus(item)}
                      >
                        <Check className="h-3 w-3" />
                        {isPending
                          ? translations.startPreparing
                          : translations.ready}
                      </Button>
                    </div>
                  );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}
