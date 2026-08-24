"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import StockRepositoryImpl from "@/data/repositories/StockRepositoryImpl";
import { useAppSelector } from "@/presentation/state/hooks";

interface AlertSettings {
  material_threshold_percent?: number;
  product_threshold_percent?: number;
  alert_email?: string;
  is_active?: boolean;
}

const DEFAULT_SETTINGS: AlertSettings = {
  material_threshold_percent: 25,
  product_threshold_percent: 25,
  alert_email: "",
  is_active: true,
};

export default function AlertSettingsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const businessId = Number(params.id);
  const { translations, accessToken, subscriberId, email } = useAppSelector(
    (s) => s.user
  );

  const [settings, setSettings] = useState<AlertSettings>({
    ...DEFAULT_SETTINGS,
    alert_email: email || "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!accessToken) return;
    try {
      const repo = new StockRepositoryImpl(translations, accessToken);
      const response = await repo.getAlertSettings(businessId);
      if (response?.data) {
        const data = response.data as AlertSettings;
        setSettings({
          material_threshold_percent:
            data.material_threshold_percent ??
            DEFAULT_SETTINGS.material_threshold_percent,
          product_threshold_percent:
            data.product_threshold_percent ??
            DEFAULT_SETTINGS.product_threshold_percent,
          alert_email: data.alert_email || email || "",
          is_active: data.is_active !== false,
        });
      }
    } catch {
      /* keep defaults */
    } finally {
      setLoading(false);
    }
  }, [accessToken, businessId, email, translations]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !subscriberId) return;
    setSaving(true);
    try {
      const repo = new StockRepositoryImpl(translations, accessToken);
      await repo.saveAlertSettings(subscriberId, businessId, {
        material_threshold_percent: settings.material_threshold_percent ?? 25,
        product_threshold_percent: settings.product_threshold_percent ?? 25,
        alert_email: settings.alert_email?.trim() || null,
        is_active: settings.is_active !== false,
      });
      toast.success(translations.settingsSaved);
      router.back();
    } catch (e) {
      toast.error((e as Error).message || translations.updateFailed);
    } finally {
      setSaving(false);
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

  return (
    <PageLayout
      back={{ label: translations.back, onClick: () => router.back() }}
      contentClassName="space-y-6"
    >
      <Card className="border-border/80 shadow-card">
        <CardHeader>
          <CardTitle>{translations.stockAlertSettings}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="material-threshold">
                {translations.materialThreshold}
              </Label>
              <Input
                id="material-threshold"
                type="number"
                inputMode="numeric"
                min={1}
                max={100}
                value={settings.material_threshold_percent ?? 25}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    material_threshold_percent: Number(e.target.value) || 25,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-threshold">
                {translations.productThreshold}
              </Label>
              <Input
                id="product-threshold"
                type="number"
                inputMode="numeric"
                min={1}
                max={100}
                value={settings.product_threshold_percent ?? 25}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    product_threshold_percent: Number(e.target.value) || 25,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alert-email">{translations.alertEmail}</Label>
              <Input
                id="alert-email"
                type="email"
                value={settings.alert_email || ""}
                onChange={(e) =>
                  setSettings({ ...settings, alert_email: e.target.value })
                }
                placeholder={translations.email}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <Label htmlFor="alerts-active" className="cursor-pointer">
                {translations.alertsActive}
              </Label>
              <Switch
                id="alerts-active"
                checked={settings.is_active !== false}
                onCheckedChange={(v) =>
                  setSettings({ ...settings, is_active: v })
                }
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-border/60 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                {translations.cancel}
              </Button>
              <Button type="submit" loading={saving}>
                {translations.save}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
