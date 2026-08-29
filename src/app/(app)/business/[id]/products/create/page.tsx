"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductForm } from "@/components/business/ProductForm";
import { UnsavedChangesDialog } from "@/components/business/UnsavedChangesDialog";
import type { ProductFormValues } from "@/components/business/ProductFormFields";
import { PageLayout } from "@/components/layout/PageLayout";
import ProductRepositoryImpl from "@/data/repositories/ProductRepositoryImpl";
import StockRepositoryImpl from "@/data/repositories/StockRepositoryImpl";
import { useBeforeUnload } from "@/hooks/useBeforeUnload";
import { useAppSelector } from "@/presentation/state/hooks";
import { getResponseData } from "@/utils/apiResponse";
import {
  fetchAvailableFeatures,
  hasPermissionAccess,
} from "@/utils/featureAccess";
import { buildProductPayload } from "@/utils/productForm";
import {
  productsPagePath,
  readCategoryParam,
} from "@/utils/productNavigation";
import type { StockMaterial } from "@/types";

export default function CreateProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();
  const businessId = Number(params.id);
  const returnCategory = readCategoryParam(searchParams.get("category"));
  const { translations, accessToken, subscriberId, language, isEmployee } =
    useAppSelector((s) => s.user);
  const lang = (language === "en" ? "en" : "tr") as "en" | "tr";

  const [saving, setSaving] = useState(false);
  const [canUseStock, setCanUseStock] = useState(false);
  const [materials, setMaterials] = useState<StockMaterial[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const pendingLeaveActionRef = useRef<(() => void) | null>(null);

  useBeforeUnload(isDirty);

  const loadStockAccess = useCallback(async () => {
    if (!accessToken || !subscriberId) return;
    const features = await fetchAvailableFeatures({
      subscriberId,
      accessToken,
      translations,
    });
    const stockAccess = hasPermissionAccess(features, "STOCK", isEmployee);
    setCanUseStock(stockAccess);

    if (stockAccess) {
      try {
        const repo = new StockRepositoryImpl(translations, accessToken);
        const response = await repo.getMaterials(businessId);
        setMaterials(getResponseData<StockMaterial[]>(response) || []);
      } catch {
        setMaterials([]);
      }
    }
  }, [accessToken, businessId, isEmployee, subscriberId, translations]);

  useEffect(() => {
    loadStockAccess();
  }, [loadStockAccess]);

  const goBackToProducts = useCallback(() => {
    router.push(productsPagePath(businessId, returnCategory));
  }, [businessId, returnCategory, router]);

  const requestLeave = useCallback(
    (action: () => void) => {
      if (!isDirty) {
        action();
        return;
      }
      pendingLeaveActionRef.current = action;
      setLeaveDialogOpen(true);
    },
    [isDirty]
  );

  const handleStayOnPage = () => {
    setLeaveDialogOpen(false);
    pendingLeaveActionRef.current = null;
  };

  const handleLeaveWithoutSaving = () => {
    setLeaveDialogOpen(false);
    const action = pendingLeaveActionRef.current;
    pendingLeaveActionRef.current = null;
    action?.();
  };

  const handleSubmit = async (
    values: ProductFormValues,
    meta: { categoryLabel: string }
  ) => {
    if (!accessToken || !subscriberId) return;
    setSaving(true);
    try {
      const payload = buildProductPayload(values, {
        language: lang,
        canUseStock,
        categoryLabel: meta.categoryLabel,
      });

      const repo = new ProductRepositoryImpl(translations, accessToken);
      const result = await repo.createProduct(subscriberId, businessId, payload);
      const created = getResponseData<{ id?: number }>(result);
      const productId = created?.id;

      if (productId && values.imageFile) {
        await repo.uploadProductImage(productId, values.imageFile);
      }

      toast.success(translations.productCreated);
      setIsDirty(false);
      router.push(productsPagePath(businessId, returnCategory));
    } catch (e) {
      toast.error((e as Error).message || translations.createFailed);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageLayout
        back={{
          label: translations.back,
          onClick: () => requestLeave(goBackToProducts),
        }}
        contentClassName="space-y-6"
      >
        <Card className="border-border/80 shadow-card">
          <CardHeader>
            <CardTitle>{translations.createProduct}</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm
              businessId={businessId}
              canUseStock={canUseStock}
              availableMaterials={materials}
              submitting={saving}
              submitLabel={translations.create}
              onSubmit={handleSubmit}
              onCancel={() => requestLeave(goBackToProducts)}
              onDirtyChange={setIsDirty}
            />
          </CardContent>
        </Card>
      </PageLayout>

      <UnsavedChangesDialog
        open={leaveDialogOpen}
        onOpenChange={(open) => {
          if (!open) handleStayOnPage();
        }}
        title={translations.unsavedChangesTitle}
        description={translations.unsavedChangesMessage}
        stayLabel={translations.stayOnPage}
        leaveLabel={translations.leaveWithoutSaving}
        onStay={handleStayOnPage}
        onLeave={handleLeaveWithoutSaving}
      />
    </>
  );
}
