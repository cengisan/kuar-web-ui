"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import StockRepositoryImpl from "@/data/repositories/StockRepositoryImpl";
import { useAppSelector } from "@/presentation/state/hooks";
import type { Material } from "@/types";

export default function EditMaterialPage() {
  const router = useRouter();
  const params = useParams<{ id: string; materialId: string }>();
  const businessId = Number(params.id);
  const materialId = Number(params.materialId);
  const { translations, accessToken, subscriberId } = useAppSelector((s) => s.user);

  const [material, setMaterial] = useState<Material | null>(null);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [threshold, setThreshold] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addQty, setAddQty] = useState("");
  const [addNote, setAddNote] = useState("");
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    if (!accessToken) return;
    try {
      const repo = new StockRepositoryImpl(translations, accessToken);
      const response = await repo.getMaterials(businessId);
      const list = (response.data as Material[]) || [];
      const found = list.find((m) => m.id === materialId);
      if (found) {
        setMaterial(found);
        setName(found.name);
        setUnit(found.unit || "");
        setThreshold(String(found.threshold ?? ""));
      } else {
        toast.error(translations.materialNotFound);
        router.replace(`/business/${businessId}/stock`);
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, businessId, materialId, router, translations]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !subscriberId) return;
    setSaving(true);
    try {
      const repo = new StockRepositoryImpl(translations, accessToken);
      await repo.updateMaterial(materialId, subscriberId, businessId, {
        name: name.trim(),
        unit: unit.trim() || null,
        threshold: threshold ? parseFloat(threshold.replace(",", ".")) : null,
      });
      toast.success(translations.materialUpdated);
      load();
    } catch (e) {
      toast.error((e as Error).message || translations.updateFailed);
    } finally {
      setSaving(false);
    }
  };

  const handleAddStock = async () => {
    if (!accessToken || !addQty) return;
    setAdding(true);
    try {
      const repo = new StockRepositoryImpl(translations, accessToken);
      await repo.addStock(
        materialId,
        parseFloat(addQty.replace(",", ".")) || 0,
        addNote.trim() || undefined
      );
      toast.success(translations.stockAdded);
      setAddOpen(false);
      setAddQty("");
      setAddNote("");
      load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setAdding(false);
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

  if (!material) return null;

  return (
    <PageLayout
      back={{ label: translations.back, onClick: () => router.back() }}
      contentClassName="space-y-6"
    ><Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{material.name}</CardTitle>
          <Button variant="outline" onClick={() => setAddOpen(true)}>
            <Plus />
            {translations.addStock}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6 rounded-lg bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">
              {translations.currentStock}
            </p>
            <p className="text-2xl font-bold">
              {material.quantity ?? 0} {material.unit || ""}
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="m-name">{translations.materialName}</Label>
              <Input
                id="m-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="m-unit">{translations.stockUnit}</Label>
                <Input
                  id="m-unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  maxLength={10}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="m-threshold">{translations.threshold}</Label>
                <Input
                  id="m-threshold"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" loading={saving}>
              {translations.save}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{translations.addStock}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-qty">{translations.quantity} *</Label>
              <Input
                id="add-qty"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                value={addQty}
                onChange={(e) => setAddQty(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-note">{translations.noteOptional}</Label>
              <Textarea
                id="add-note"
                value={addNote}
                onChange={(e) => setAddNote(e.target.value)}
                rows={2}
                maxLength={200}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              {translations.cancel}
            </Button>
            <Button onClick={handleAddStock} loading={adding} disabled={!addQty}>
              {translations.add}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
