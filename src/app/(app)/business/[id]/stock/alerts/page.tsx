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
  email_enabled?: boolean;
  sms_enabled?: boolean;
  push_enabled?: boolean;
  threshold_percentage?: number;
  notification_email?: string;
  notification_phone?: string;
}

export default function AlertSettingsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const businessId = Number(params.id);
  const { translations, accessToken, subscriberId } = useAppSelector((s) => s.user);

  const [settings, setSettings] = useState<AlertSettings>({
    email_enabled: false,
    sms_enabled: false,
    push_enabled: true,
    threshold_percentage: 20,
    notification_email: "",
    notification_phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!accessToken) return;
    try {
      const repo = new StockRepositoryImpl(translations, accessToken);
      const response = await repo.getAlertSettings(businessId);
      if (response?.data) {
        setSettings({ ...settings, ...(response.data as AlertSettings) });
      }
    } catch {
      /* using defaults */
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, businessId, translations]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !subscriberId) return;
    setSaving(true);
    try {
      const repo = new StockRepositoryImpl(translations, accessToken);
      await repo.saveAlertSettings(
        subscriberId,
        businessId,
        settings as Record<string, unknown>
      );
      toast.success(translations.settingsSaved);
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
    ><Card>
        <CardHeader>
          <CardTitle>{translations.alertSettings}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <Label htmlFor="email-alert">
                {translations.emailNotifications}
              </Label>
              <Switch
                id="email-alert"
                checked={!!settings.email_enabled}
                onCheckedChange={(v) => setSettings({ ...settings, email_enabled: v })}
              />
            </div>

            {settings.email_enabled && (
              <div className="space-y-2">
                <Label htmlFor="email">{translations.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.notification_email || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, notification_email: e.target.value })
                  }
                />
              </div>
            )}

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <Label htmlFor="sms-alert">
                {translations.smsNotifications}
              </Label>
              <Switch
                id="sms-alert"
                checked={!!settings.sms_enabled}
                onCheckedChange={(v) => setSettings({ ...settings, sms_enabled: v })}
              />
            </div>

            {settings.sms_enabled && (
              <div className="space-y-2">
                <Label htmlFor="phone">{translations.phone}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={settings.notification_phone || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, notification_phone: e.target.value })
                  }
                />
              </div>
            )}

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <Label htmlFor="push-alert">
                {translations.pushNotifications}
              </Label>
              <Switch
                id="push-alert"
                checked={!!settings.push_enabled}
                onCheckedChange={(v) => setSettings({ ...settings, push_enabled: v })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="threshold">
                {translations.thresholdPercentage}: {settings.threshold_percentage}%
              </Label>
              <Input
                id="threshold"
                type="range"
                min="5"
                max="100"
                step="5"
                value={settings.threshold_percentage || 20}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    threshold_percentage: Number(e.target.value),
                  })
                }
                className="h-2 cursor-pointer"
              />
            </div>

            <Button type="submit" loading={saving} className="w-full">
              {translations.save}
            </Button>
          </form>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
