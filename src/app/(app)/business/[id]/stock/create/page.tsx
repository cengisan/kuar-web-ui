"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StockRepositoryImpl from "@/data/repositories/StockRepositoryImpl";
import { useAppSelector } from "@/presentation/state/hooks";

export default function CreateMaterialPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const businessId = Number(params.id);
  const { translations, accessToken, subscriberId } = useAppSelector((s) => s.user);

  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [threshold, setThreshold] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !subscriberId || !name.trim()) return;
    setSaving(true);
    try {
      const repo = new StockRepositoryImpl(translations, accessToken);
      await repo.createMaterial(subscriberId, businessId, {
        name: name.trim(),
        unit: unit.trim().toUpperCase() || "KILOGRAM",
        current_stock: parseFloat(quantity.replace(",", ".")) || 0,
      });
      toast.success(translations.materialCreated);
      router.push(`/business/${businessId}/stock`);
    } catch (e) {
      toast.error((e as Error).message || translations.createFailed);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageLayout
      back={{ label: translations.back, onClick: () => router.back() }}
      contentClassName="space-y-6"
    >
      <Card className="border-border/80 shadow-card">
        <CardHeader>
          <CardTitle>{translations.createMaterial}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="m-name">{translations.materialName} *</Label>
              <Input
                id="m-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                required
                autoFocus
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="m-unit">{translations.stockUnit}</Label>
                <Input
                  id="m-unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="kg"
                  maxLength={10}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="m-quantity">{translations.quantity}</Label>
                <Input
                  id="m-quantity"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
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
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                {translations.cancel}
              </Button>
              <Button type="submit" loading={saving}>
                {translations.create}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
