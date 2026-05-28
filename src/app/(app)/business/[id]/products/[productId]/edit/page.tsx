"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ProductForm } from "@/components/business/ProductForm";
import type { ProductFormValues } from "@/components/business/ProductFormFields";
import { PageLayout } from "@/components/layout/PageLayout";
import ProductRepositoryImpl from "@/data/repositories/ProductRepositoryImpl";
import StockRepositoryImpl from "@/data/repositories/StockRepositoryImpl";
import { useAppSelector } from "@/presentation/state/hooks";
import { getResponseData, isActionSuccess } from "@/utils/apiResponse";
import {
  fetchAvailableFeatures,
  hasPermissionAccess,
} from "@/utils/featureAccess";
import { buildProductPayload } from "@/utils/productForm";
import { resolveCategoryForApi } from "@/config/productCategories";
import type { Product, StockMaterial } from "@/types";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string; productId: string }>();
  const businessId = Number(params.id);
  const productId = Number(params.productId);
  const { translations, accessToken, subscriberId, language, isEmployee } =
    useAppSelector((s) => s.user);
  const lang = (language === "en" ? "en" : "tr") as "en" | "tr";

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
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

  const loadProduct = useCallback(async () => {
    if (!accessToken) return;
    try {
      const repo = new ProductRepositoryImpl(translations, accessToken);
      const response = await repo.getProducts(businessId);
      const list = getResponseData<Product[]>(response) || [];
      const found = list.find((p) => p.id === productId);
      if (found) {
        setProduct(found);
      } else {
        toast.error(translations.menuProductDoesNotExist);
        router.replace(`/business/${businessId}/products`);
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, businessId, productId, router, translations]);

  useEffect(() => {
    loadProduct();
    loadStockAccess();
  }, [loadProduct, loadStockAccess]);

  const handleSubmit = async (values: ProductFormValues) => {
    if (!accessToken || !product) return;
    setSaving(true);
    try {
      const categoryLabel = resolveCategoryForApi(values, lang);
      const payload = buildProductPayload(values, {
        language: lang,
        canUseStock,
        categoryLabel,
      });

      const repo = new ProductRepositoryImpl(translations, accessToken);
      const result = await repo.updateProduct(productId, businessId, payload);

      if (isActionSuccess(result)) {
        if (values.imageFile) {
          const existingImage =
            product.product_image?.[0] || product.images?.[0];
          if (existingImage?.id) {
            await repo.updateProductImage(productId, existingImage.id, values.imageFile);
          } else {
            await repo.uploadProductImage(productId, values.imageFile);
          }
        }
        toast.success(translations.productUpdated);
        router.push(`/business/${businessId}/products`);
      } else {
        toast.error((result as { message?: string }).message);
      }
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

  if (!product) return null;

  return (
    <PageLayout
      back={{ label: translations.back, onClick: () => router.back() }}
      contentClassName="space-y-6"
    >
      <Card className="border-border/80 shadow-card">
        <CardHeader>
          <CardTitle>{translations.editProduct}</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm
            businessId={businessId}
            initial={product}
            canUseStock={canUseStock}
            availableMaterials={materials}
            submitting={saving}
            submitLabel={translations.save}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
          />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
