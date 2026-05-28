"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  MenuFormFields,
  type MenuFormValues,
} from "@/components/business/MenuFormFields";
import { PageLayout } from "@/components/layout/PageLayout";
import DigitalMenuRepositoryImpl from "@/data/repositories/DigitalMenuRepositoryImpl";
import { useAppSelector } from "@/presentation/state/hooks";
import { getResponseData } from "@/utils/apiResponse";
import type { DigitalMenu } from "@/types";

const defaultValues = (currency: string): MenuFormValues => ({
  name: "",
  businessName: "",
  instagramUsername: "",
  currency,
  theme: "menu1",
  isAvailable: true,
});

export default function CreateMenuPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const businessId = Number(params.id);
  const { translations, accessToken, subscriberId, currency: userCurrency } =
    useAppSelector((s) => s.user);

  const [values, setValues] = useState<MenuFormValues>(() =>
    defaultValues(userCurrency || "TRY")
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingLimit, setCheckingLimit] = useState(true);

  const patchValues = (patch: Partial<MenuFormValues>) => {
    setValues((prev) => ({ ...prev, ...patch }));
  };

  const checkExistingMenus = useCallback(async () => {
    if (!accessToken || !businessId) {
      setCheckingLimit(false);
      return;
    }
    try {
      const repo = new DigitalMenuRepositoryImpl(translations, accessToken);
      const response = await repo.getAllDigitalMenusByBusiness(businessId);
      const list = getResponseData<DigitalMenu[]>(response) || [];
      if (list.length > 0) {
        toast.error(
          translations.digitalMenuLimitReached
        );
        router.replace(`/business/${businessId}/menus`);
      }
    } catch {
      /* allow create if check fails */
    } finally {
      setCheckingLimit(false);
    }
  }, [accessToken, businessId, router, translations]);

  useEffect(() => {
    checkExistingMenus();
  }, [checkExistingMenus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.name.trim() || !accessToken || !subscriberId) {
      toast.error(translations.pleaseFillAllFields);
      return;
    }

    setLoading(true);
    try {
      const repo = new DigitalMenuRepositoryImpl(translations, accessToken);
      const result = await repo.createDigitalMenu({
        subscriber_id: subscriberId,
        name: values.name.trim(),
        business_name: values.businessName.trim() || null,
        is_available: values.isAvailable,
        theme: values.theme,
        currency: values.currency,
        social_media: values.instagramUsername.trim() || null,
        business_id: businessId,
      });

      if (!result.success) {
        toast.error(result.message || translations.createFailed);
        return;
      }

      const createdId =
        (result.data?.data as { id?: string } | undefined)?.id ||
        (result.data as { id?: string } | undefined)?.id;

      if (createdId && imageFile) {
        const uploadResult = await repo.uploadDigitalMenuImage(createdId, imageFile);
        if (!uploadResult.success) {
          toast.error(uploadResult.message || translations.imageUploadFailed);
          router.push(`/business/${businessId}/menus`);
          return;
        }
      }

      toast.success(result.message || translations.menuCreated);
      router.push(`/business/${businessId}/menus`);
    } finally {
      setLoading(false);
    }
  };

  if (checkingLimit) {
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
    ><Card className="border-border/80 shadow-card">
        <CardHeader>
          <CardTitle>{translations.createMenu}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <MenuFormFields
              values={values}
              onChange={patchValues}
              translations={translations}
              imageFile={imageFile}
              onImageChange={setImageFile}
              idPrefix="create-menu"
            />

            <div className="flex justify-end gap-3 border-t border-border/60 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                {translations.cancel}
              </Button>
              <Button type="submit" loading={loading}>
                {translations.create}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
