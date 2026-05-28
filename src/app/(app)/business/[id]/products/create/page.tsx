"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductForm } from "@/components/business/ProductForm";
import type { ProductFormValues } from "@/components/business/ProductFormFields";
import { PageLayout } from "@/components/layout/PageLayout";
import ProductRepositoryImpl from "@/data/repositories/ProductRepositoryImpl";
import StockRepositoryImpl from "@/data/repositories/StockRepositoryImpl";
import { useAppSelector } from "@/presentation/state/hooks";
import { getResponseData } from "@/utils/apiResponse";
import {
  fetchAvailableFeatures,
  hasPermissionAccess,
} from "@/utils/featureAccess";
import { buildProductPayload } from "@/utils/productForm";
import { resolveCategoryForApi } from "@/config/productCategories";
import type { StockMaterial } from "@/types";

export default function CreateProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const businessId = Number(params.id);
  const { translations, accessToken, subscriberId, language, isEmployee } =
    useAppSelector((s) => s.user);
  const lang = (language === "en" ? "en" : "tr") as "en" | "tr";

  const [saving, setSaving] = useState(false);
  const [canUseStock, setCanUseStock] = useState(false);
  const [materials, setMaterials] = useState<StockMaterial[]>([]);

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

  const handleSubmit = async (values: ProductFormValues) => {
    if (!accessToken || !subscriberId) return;
    setSaving(true);
    try {
      const categoryLabel = resolveCategoryForApi(values, lang);
      const payload = buildProductPayload(values, {
        language: lang,
        canUseStock,
        categoryLabel,
      });

      const repo = new ProductRepositoryImpl(translations, accessToken);
      const result = await repo.createProduct(subscriberId, businessId, payload);
      const created = getResponseData<{ id?: number }>(result);
      const productId = created?.id;

      if (productId && values.imageFile) {
        await repo.uploadProductImage(productId, values.imageFile);
      }

      toast.success(translations.productCreated);
      router.push(`/business/${businessId}/products`);
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
            onCancel={() => router.back()}
          />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
