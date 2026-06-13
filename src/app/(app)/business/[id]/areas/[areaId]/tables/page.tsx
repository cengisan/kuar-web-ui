"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { Plus, Trash2, Users } from "lucide-react";
import { cn } from "@/lib/cn";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TableOrderStatusBadges } from "@/components/tables/TableOrderStatusBadges";
import TableRepositoryImpl from "@/data/repositories/TableRepositoryImpl";
import webSocketService from "@/services/WebSocketService";
import { useAppSelector } from "@/presentation/state/hooks";
import type { CafeTable } from "@/types";

interface TableCardEvent {
  eventType?: string;
  tableId?: number;
  orderId?: number | null;
  status?: string;
  currentOrderTotal?: number | null;
  pendingCount?: number;
  preparingCount?: number;
  readyCount?: number;
  deliveredCount?: number;
}

const STATUS_COLORS: Record<string, "default" | "success" | "warning" | "destructive"> = {
  EMPTY: "success",
  AVAILABLE: "success",
  OCCUPIED: "destructive",
  RESERVED: "warning",
  CLEANING: "default",
};

const STATUS_ICON_STYLES: Record<string, { icon: string; bg: string }> = {
  EMPTY: { icon: "text-emerald-500", bg: "bg-emerald-500/20" },
  AVAILABLE: { icon: "text-emerald-500", bg: "bg-emerald-500/20" },
  OCCUPIED: { icon: "text-red-500", bg: "bg-red-500/20" },
  RESERVED: { icon: "text-amber-500", bg: "bg-amber-500/20" },
  CLEANING: { icon: "text-muted-foreground", bg: "bg-muted" },
};

function TableFurnitureIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M21,10H19V6C19,4.89 18.1,4 17,4H7C5.89,4 5,4.89 5,6V10H3C1.89,10 1,10.89 1,12V19C1,20.11 1.89,21 3,21H21C22.11,21 23,20.11 23,19V12C23,10.89 22.11,10 21,10M7,6H17V10H7V6M3,12H21V19H3V12Z" />
    </svg>
  );
}

export default function TablesPage() {
  const router = useRouter();
  const params = useParams<{ id: string; areaId: string }>();
  const searchParams = useSearchParams();
  const businessId = Number(params.id);
  const areaId = Number(params.areaId);
  const isCashierMode = searchParams.get("mode") === "cashier";
  const { translations, accessToken, subscriberId, employeeData } = useAppSelector(
    (s) => s.user
  );
  const wsOwnerId = subscriberId ?? employeeData?.employerId ?? null;

  const [tables, setTables] = useState<CafeTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [bulkPrefix, setBulkPrefix] = useState("M");
  const [bulkCount, setBulkCount] = useState("1");
  const [bulkCapacity, setBulkCapacity] = useState("4");
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CafeTable | null>(null);
  const refreshDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchTables = useCallback(async () => {
    if (!accessToken) return;
    try {
      const repo = new TableRepositoryImpl(translations, accessToken);
      const result = await repo.getTablesByArea(areaId);
      setTables(result.success ? result.tables || [] : []);
    } finally {
      setLoading(false);
    }
  }, [accessToken, areaId, translations]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const scheduleFullRefresh = useCallback(() => {
    if (refreshDebounceRef.current) {
      clearTimeout(refreshDebounceRef.current);
    }
    refreshDebounceRef.current = setTimeout(() => {
      refreshDebounceRef.current = null;
      fetchTables();
    }, 350);
  }, [fetchTables]);

  const applyTableCardEvent = useCallback(
    (event: TableCardEvent) => {
      const tableId = event.tableId;
      if (tableId == null) return;

      setTables((prev) => {
        const idx = prev.findIndex((t) => Number(t.id) === Number(tableId));
        if (idx === -1) {
          scheduleFullRefresh();
          return prev;
        }
        const row = prev[idx];
        const next = [...prev];
        const hasOrder = event.orderId != null;
        next[idx] = {
          ...row,
          status: event.status != null ? event.status : row.status,
          currentOrderTotal: hasOrder
            ? event.currentOrderTotal != null
              ? event.currentOrderTotal
              : row.currentOrderTotal
            : null,
          pendingCount: event.pendingCount ?? 0,
          preparingCount: event.preparingCount ?? 0,
          readyCount: event.readyCount ?? 0,
          deliveredCount: event.deliveredCount ?? 0,
        };
        return next;
      });
    },
    [scheduleFullRefresh]
  );

  const handleRealtimeEvent = useCallback(
    (event: unknown) => {
      const typed = event as TableCardEvent;
      if (typed?.eventType === "TABLE_CARD_UPDATED") {
        applyTableCardEvent(typed);
        return;
      }
      scheduleFullRefresh();
    },
    [applyTableCardEvent, scheduleFullRefresh]
  );

  useEffect(() => {
    return () => {
      if (refreshDebounceRef.current) {
        clearTimeout(refreshDebounceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!wsOwnerId) return;

    webSocketService.connect(wsOwnerId, {
      onTableUpdate: handleRealtimeEvent,
      onOrderUpdate: handleRealtimeEvent,
      onKitchenUpdate: handleRealtimeEvent,
    });

    return () => {
      webSocketService.removeHandler("onTableUpdate", handleRealtimeEvent);
      webSocketService.removeHandler("onOrderUpdate", handleRealtimeEvent);
      webSocketService.removeHandler("onKitchenUpdate", handleRealtimeEvent);
    };
  }, [wsOwnerId, handleRealtimeEvent]);

  const handleCreate = async () => {
    if (!accessToken) return;
    setCreating(true);
    try {
      const repo = new TableRepositoryImpl(translations, accessToken);
      const result = await repo.createTablesBulk({
        prefix: bulkPrefix,
        count: parseInt(bulkCount, 10) || 1,
        capacity: parseInt(bulkCapacity, 10) || 4,
        areaId,
        business_id: businessId,
        existingTables: tables,
      });
      if (result.created.length > 0) {
        toast.success(
          `${result.created.length} ${translations.tableCreated}`
        );
      }
      if (result.failed.length > 0 && result.firstError) {
        toast.error(result.firstError);
      }
      setCreateOpen(false);
      fetchTables();
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!accessToken || !deleteTarget) return;
    const repo = new TableRepositoryImpl(translations, accessToken);
    const r = await repo.deleteTable(deleteTarget.id);
    if (r.success) {
      toast.success(translations.tableDeleted);
      setDeleteTarget(null);
      fetchTables();
    } else {
      toast.error(r.message);
    }
  };

  const handleTableClick = (table: CafeTable) => {
    const status = table.status || "EMPTY";

    if (isCashierMode) {
      if (status === "OCCUPIED") {
        router.push(
          `/business/${businessId}/tables/${table.id}/cashier?areaId=${areaId}`
        );
        return;
      }
      toast.info(
        translations.tableNotAvailableForCashier
      );
      return;
    }

    router.push(`/business/${businessId}/tables/${table.id}/order`);
  };

  const handleBack = () => {
    if (isCashierMode) {
      router.push(`/business/${businessId}/areas?mode=cashier`);
      return;
    }
    router.back();
  };

  return (
    <PageLayout
      back={{ label: translations.back, onClick: handleBack }}
      contentClassName="space-y-6"
    ><div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {isCashierMode
            ? translations.cashier
            : translations.tables}
        </h1>
        {!isCashierMode && (
          <Button onClick={() => setCreateOpen(true)}>
            <Plus />
            {translations.createTable}
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : tables.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-lg font-semibold">
            {translations.noTablesYet}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {tables.map((table) => {
            const status = table.status || "EMPTY";
            const variant = STATUS_COLORS[status] || "default";
            const iconStyles = STATUS_ICON_STYLES[status] || STATUS_ICON_STYLES.EMPTY;
            return (
              <Card
                key={table.id}
                className="cursor-pointer transition-colors hover:border-primary"
                onClick={() => handleTableClick(table)}
              >
                <CardContent className="space-y-2 p-4 text-center">
                  <div
                    className={cn(
                      "mx-auto mb-1 flex h-14 w-14 items-center justify-center rounded-full",
                      iconStyles.bg
                    )}
                  >
                    <TableFurnitureIcon className={cn("h-7 w-7", iconStyles.icon)} />
                  </div>
                  <p className="text-2xl font-bold">{table.tableNumber}</p>
                  {status === "OCCUPIED" &&
                    table.currentOrderTotal != null &&
                    table.currentOrderTotal > 0 && (
                      <p className="text-sm font-bold text-emerald-500">
                        ₺{table.currentOrderTotal.toFixed(2)}
                      </p>
                    )}
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{table.capacity || 0}</span>
                  </div>
                  <TableOrderStatusBadges table={table} />
                  <Badge variant={variant}>
                    {status === "EMPTY" || status === "AVAILABLE"
                      ? translations.tableStatusEmpty || translations.statusAvailable
                      : status === "OCCUPIED"
                        ? translations.tableStatusOccupied || translations.statusOccupied
                        : status === "CLEANING"
                          ? translations.statusCleaning
                          : translations.tableStatusReserved || translations.statusReserved}
                  </Badge>
                  {!isCashierMode && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(table);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{translations.createTable}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prefix">{translations.tablePrefix}</Label>
              <Input
                id="prefix"
                value={bulkPrefix}
                onChange={(e) => setBulkPrefix(e.target.value.toUpperCase())}
                maxLength={5}
                placeholder="M"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="count">{translations.count}</Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  max="50"
                  value={bulkCount}
                  onChange={(e) => setBulkCount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">{translations.capacityLabel}</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  max="100"
                  value={bulkCapacity}
                  onChange={(e) => setBulkCapacity(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              {translations.cancel}
            </Button>
            <Button onClick={handleCreate} loading={creating}>
              {translations.create}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{translations.confirmDeleteTable}</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              {translations.cancel}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {translations.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
