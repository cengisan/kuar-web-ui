"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Download, QrCode } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MenuFormFields,
  type MenuFormValues,
} from "@/components/business/MenuFormFields";
import { PageLayout } from "@/components/layout/PageLayout";
import DigitalMenuRepositoryImpl from "@/data/repositories/DigitalMenuRepositoryImpl";
import QrRepositoryImpl from "@/data/repositories/QrRepositoryImpl";
import { parseInstagramUsername } from "@/config/menuFormOptions";
import { useAppSelector } from "@/presentation/state/hooks";
import { getResponseData, getActionMessage, isActionSuccess } from "@/utils/apiResponse";
import type { DigitalMenu } from "@/types";

function getMenuLogo(menu: DigitalMenu) {
  const logo = menu.digital_menu_image?.[0] ?? menu.images?.[0];

  return {
    id: logo?.id ?? null,
    url: menu.image_url || logo?.image_url || logo?.url || null,
  };
}

function menuToFormValues(menu: DigitalMenu): MenuFormValues {
  return {
    name: menu.name,
    businessName: menu.business_name || "",
    instagramUsername: parseInstagramUsername(menu.social_media),
    currency: menu.currency || "TRY",
    theme: menu.theme || "menu1",
    isAvailable: menu.is_available ?? true,
  };
}

export default function EditMenuPage() {
  const router = useRouter();
  const params = useParams<{ id: string; menuId: string }>();
  const businessId = Number(params.id);
  const menuId = params.menuId;
  const { translations, accessToken, subscriberId } = useAppSelector((s) => s.user);

  const [menu, setMenu] = useState<DigitalMenu | null>(null);
  const [values, setValues] = useState<MenuFormValues>(() => menuToFormValues({ id: "", name: "" }));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [logoImageId, setLogoImageId] = useState<number | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrSrc, setQrSrc] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);

  const patchValues = (patch: Partial<MenuFormValues>) => {
    setValues((prev) => ({ ...prev, ...patch }));
  };

  const loadMenu = useCallback(async () => {
    if (!accessToken) return;
    try {
      const repo = new DigitalMenuRepositoryImpl(translations, accessToken);
      const response = await repo.getAllDigitalMenusByBusiness(businessId);
      const list = getResponseData<DigitalMenu[]>(response) || [];
      const found = list.find((m) => String(m.id) === menuId);
      if (found) {
        setMenu(found);
        setValues(menuToFormValues(found));
        const logo = getMenuLogo(found);
        setLogoImageId(logo.id);
        setExistingImageUrl(logo.url);
      } else {
        toast.error(translations.menuDoesNotExist);
        router.replace(`/business/${businessId}/menus`);
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, businessId, menuId, router, translations]);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const displayTitle = useMemo(() => values.name || menu?.name || "", [menu?.name, values.name]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !subscriberId || !values.name.trim()) {
      toast.error(translations.pleaseFillAllFields);
      return;
    }

    setSaving(true);
    try {
      const repo = new DigitalMenuRepositoryImpl(translations, accessToken);
      const result = await repo.updateDigitalMenu(menuId, {
        subscriber_id: subscriberId,
        name: values.name.trim(),
        business_name: values.businessName.trim() || null,
        is_available: values.isAvailable,
        theme: values.theme,
        currency: values.currency,
        social_media: values.instagramUsername.trim() || null,
      });

      if (!isActionSuccess(result)) {
        toast.error(getActionMessage(result, translations.updateFailed));
        return;
      }

      if (imageFile) {
        const imageResult = logoImageId
          ? await repo.updateDigitalMenuImage(menuId, logoImageId, imageFile)
          : await repo.uploadDigitalMenuImage(menuId, imageFile);

        if (!imageResult?.success) {
          toast.error(imageResult?.message || translations.imageUploadFailed);
          return;
        }
      }

      toast.success(getActionMessage(result, translations.menuUpdated));
      setImageFile(null);
      loadMenu();
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (!file) {
      setExistingImageUrl(null);
    }
  };

  const handleShowQr = async () => {
    if (!accessToken) return;
    setQrOpen(true);
    setQrLoading(true);
    try {
      const repo = new QrRepositoryImpl(translations, accessToken);
      const src = await repo.getQrCode(menuId);
      setQrSrc(src);
    } catch (err) {
      toast.error((err as Error).message);
      setQrOpen(false);
    } finally {
      setQrLoading(false);
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

  if (!menu) return null;

  return (
    <PageLayout
      back={{ label: translations.back, onClick: () => router.back() }}
      contentClassName="space-y-6"
    ><Card className="border-border/80 shadow-card">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>{displayTitle}</CardTitle>
          <Button variant="outline" onClick={handleShowQr}>
            <QrCode />
            {translations.qrCode}
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <MenuFormFields
              values={values}
              onChange={patchValues}
              translations={translations}
              imageFile={imageFile}
              onImageChange={handleImageChange}
              existingImageUrl={existingImageUrl}
              idPrefix="edit-menu"
            />

            <div className="flex justify-end gap-3 border-t border-border/60 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                {translations.cancel}
              </Button>
              <Button type="submit" loading={saving}>
                {translations.save}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{translations.qrCode}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            {qrLoading ? (
              <Spinner size="lg" />
            ) : qrSrc ? (
              <>
                <img src={qrSrc} alt="QR" className="h-64 w-64 rounded-lg bg-white p-4" />
                <Button asChild variant="outline">
                  <a href={qrSrc} download={`menu-${menuId}-qr.png`}>
                    <Download />
                    {translations.download}
                  </a>
                </Button>
              </>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
