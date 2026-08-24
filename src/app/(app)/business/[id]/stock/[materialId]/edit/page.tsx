"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StockPercentageBar } from "@/components/business/StockPercentageBar";
import StockRepositoryImpl from "@/data/repositories/StockRepositoryImpl";
import { useAppSelector } from "@/presentation/state/hooks";
import {
  formatMovementLine,
  getMovementNoteLabel,
} from "@/lib/stockMovementDisplay";
import { getUnitLabel } from "@/utils/measurementUnits";
import type { Material, StockMovement } from "@/types";

export default function EditMaterialPage() {
  const router = useRouter();
  const params = useParams<{ id: string; materialId: string }>();
  const businessId = Number(params.id);
  const materialId = Number(params.materialId);
  const { translations, accessToken, subscriberId, language } = useAppSelector(
    (s) => s.user
  );

  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null);
  const [name, setName] = useState("");
  const [addQuantity, setAddQuantity] = useState("");
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const lang = language === "en" ? "en" : "tr";

  const loadMovements = useCallback(async () => {
    if (!accessToken) return;
    try {
      const repo = new StockRepositoryImpl(translations, accessToken);
      const response = await repo.getStockMovements(materialId);
      setMovements((response.data as StockMovement[]) || []);
    } catch (e) {
      if (!(e as { sessionExpired?: boolean }).sessionExpired) {
        toast.error((e as Error).message);
      }
    }
  }, [accessToken, materialId, translations]);

  const loadMaterial = useCallback(async () => {
    if (!accessToken) return;
    try {
      const repo = new StockRepositoryImpl(translations, accessToken);
      const response = await repo.getMaterials(businessId);
      const list = (response.data as Material[]) || [];
      const found = list.find((m) => m.id === materialId);
      if (found) {
        setCurrentMaterial(found);
        setName(found.name);
      } else {
        toast.error(translations.noMaterialsFound);
        router.replace(`/business/${businessId}/stock`);
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, businessId, materialId, router, translations]);

  useEffect(() => {
    loadMaterial();
    loadMovements();
  }, [loadMaterial, loadMovements]);

  const handleAddStock = async () => {
    if (!accessToken || !addQuantity) {
      toast.error(translations.pleaseFillAllFields);
      return;
    }
    setIsLoading(true);
    try {
      const repo = new StockRepositoryImpl(translations, accessToken);
      const response = await repo.addStock(
        materialId,
        parseFloat(addQuantity.replace(",", ".")) || 0,
        translations.stockMovementAddedNote
      );
      setCurrentMaterial((response.data as Material) || currentMaterial);
      setAddQuantity("");
      await loadMovements();
      await loadMaterial();
      toast.success(translations.stockUpdated);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!accessToken || !subscriberId || !currentMaterial) return;
    setIsLoading(true);
    try {
      const repo = new StockRepositoryImpl(translations, accessToken);
      await repo.updateMaterial(materialId, subscriberId, businessId, {
        name: name.trim(),
        unit: currentMaterial.unit,
        current_stock: currentMaterial.current_stock,
      });
      toast.success(translations.stockUpdated);
      router.push(`/business/${businessId}/stock`);
    } catch (e) {
      toast.error((e as Error).message || translations.updateFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!accessToken) return;
    setIsLoading(true);
    try {
      const repo = new StockRepositoryImpl(translations, accessToken);
      await repo.deleteMaterial(materialId);
      toast.success(translations.delete);
      router.push(`/business/${businessId}/stock`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setIsLoading(false);
      setDeleteOpen(false);
    }
  };

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

  if (!currentMaterial) return null;

  return (
    <PageLayout
      back={{ label: translations.back, onClick: () => router.back() }}
      contentClassName="space-y-6"
    >
      <Card className="border-border/80 shadow-card">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>{translations.editMaterial}</CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteOpen(true)}
            aria-label={translations.delete}
          >
            <Trash2 className="size-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="m-name">{translations.materialName}</Label>
              <Input
                id="m-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={translations.enterMaterialName}
                maxLength={100}
              />
            </div>

            <div className="rounded-lg bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">
                {translations.currentStock}
              </p>
              <p className="text-lg font-semibold">
                {currentMaterial.current_stock ?? 0}{" "}
                {getUnitLabel(currentMaterial.unit || "", lang)}
              </p>
              <StockPercentageBar
                percentage={currentMaterial.stock_percentage}
                className="mt-3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-qty">{translations.addStock}</Label>
              <Input
                id="add-qty"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                value={addQuantity}
                onChange={(e) => setAddQuantity(e.target.value)}
                placeholder={translations.enterStockAmount}
              />
            </div>
            <Button
              type="button"
              onClick={handleAddStock}
              loading={isLoading}
              disabled={!addQuantity}
            >
              {translations.addStock}
            </Button>

            <div className="flex justify-end gap-3 border-t border-border/60 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                {translations.cancel}
              </Button>
              <Button type="button" onClick={handleSave} loading={isLoading}>
                {translations.save}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-card">
        <CardHeader>
          <CardTitle>{translations.stockMovements}</CardTitle>
        </CardHeader>
        <CardContent>
          {movements.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              {translations.noMovementsFound}
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {movements.map((item) => (
                <li
                  key={item.id}
                  className="space-y-1 py-4 first:pt-0 last:pb-0"
                >
                  <p className="font-medium">
                    {formatMovementLine(item, translations, lang)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.created_date
                      ? new Date(item.created_date).toLocaleString()
                      : "-"}
                  </p>
                  {item.note ? (
                    <p className="text-xs text-muted-foreground">
                      {getMovementNoteLabel(item.note, translations)}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {translations.delete} {currentMaterial.name}?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              {translations.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              loading={isLoading}
            >
              {translations.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
