"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { Bell, Boxes, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import StockRepositoryImpl from "@/data/repositories/StockRepositoryImpl";
import { useAppSelector } from "@/presentation/state/hooks";
import type { Material } from "@/types";

export default function StockPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const businessId = Number(params.id);
  const { translations, accessToken } = useAppSelector((s) => s.user);

  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Material | null>(null);

  const load = useCallback(async () => {
    if (!accessToken) return;
    try {
      const repo = new StockRepositoryImpl(translations, accessToken);
      const response = await repo.getMaterials(businessId);
      if (Array.isArray(response.data)) {
        setMaterials(response.data as Material[]);
      } else {
        setMaterials([]);
      }
    } catch {
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken, businessId, translations]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    if (!accessToken || !deleteTarget) return;
    const repo = new StockRepositoryImpl(translations, accessToken);
    try {
      await repo.deleteMaterial(deleteTarget.id);
      toast.success(translations.materialDeleted);
      setDeleteTarget(null);
      load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <PageLayout
      back={{ label: translations.back, onClick: () => router.back() }}
      contentClassName="space-y-6"
    ><div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {translations.stockManagement}
        </h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/business/${businessId}/stock/alerts`}>
              <Bell />
              {translations.alertSettings}
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/business/${businessId}/stock/create`}>
              <Plus />
              {translations.createMaterial}
            </Link>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : materials.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <Boxes className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold">
            {translations.noMaterials}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {materials.map((material) => {
            const low =
              typeof material.quantity === "number" &&
              typeof material.threshold === "number" &&
              material.quantity <= material.threshold;
            return (
              <Card key={material.id}>
                <CardContent className="flex items-center gap-3 p-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      low ? "bg-destructive/15" : "bg-orange-500/15"
                    }`}
                  >
                    <Boxes
                      className={`h-5 w-5 ${
                        low ? "text-destructive" : "text-orange-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-semibold">{material.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {material.quantity ?? 0} {material.unit || ""}
                      {material.threshold != null && (
                        <span className="ml-2">
                          / {translations.threshold}: {material.threshold}
                        </span>
                      )}
                    </p>
                  </div>
                  {low && (
                    <Badge variant="destructive">
                      {translations.lowStock}
                    </Badge>
                  )}
                  <Button asChild size="icon" variant="ghost">
                    <Link href={`/business/${businessId}/stock/${material.id}/edit`}>
                      <Pencil />
                    </Link>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setDeleteTarget(material)}
                  >
                    <Trash2 />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {translations.confirmDeleteMaterial}
            </DialogTitle>
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
