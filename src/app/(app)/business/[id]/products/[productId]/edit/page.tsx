"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ProductForm } from "@/components/business/ProductForm";
import { UnsavedChangesDialog } from "@/components/business/UnsavedChangesDialog";
import type { ProductFormValues } from "@/components/business/ProductFormFields";
import { PageLayout } from "@/components/layout/PageLayout";
import ProductRepositoryImpl from "@/data/repositories/ProductRepositoryImpl";
import StockRepositoryImpl from "@/data/repositories/StockRepositoryImpl";
import { useBeforeUnload } from "@/hooks/useBeforeUnload";
import { useAppSelector } from "@/presentation/state/hooks";
import { getResponseData, isActionSuccess } from "@/utils/apiResponse";
import {
  fetchAvailableFeatures,
  hasPermissionAccess,
} from "@/utils/featureAccess";
import { buildProductPayload } from "@/utils/productForm";
import {
  productsPagePath,
  readCategoryParam,
} from "@/utils/productNavigation";
import type { Product, StockMaterial } from "@/types";

export default function EditProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ id: string; productId: string }>();
  const businessId = Number(params.id);
  const productId = Number(params.productId);
  const categoryFromQuery = readCategoryParam(searchParams.get("category"));
  const { translations, accessToken, subscriberId, language, isEmployee } =
    useAppSelector((s) => s.user);
  const lang = (language === "en" ? "en" : "tr") as "en" | "tr";

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
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

  const returnCategory =
    categoryFromQuery || readCategoryParam(product?.category ?? null);

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
    if (!accessToken || !subscriberId || !product) return;
    setSaving(true);
    try {
      const payload = buildProductPayload(values, {
        language: lang,
        canUseStock,
        categoryLabel: meta.categoryLabel,
      });

      const repo = new ProductRepositoryImpl(translations, accessToken);
      const result = await repo.updateProduct(
        productId,
        subscriberId,
        businessId,
        payload
      );

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
        setIsDirty(false);
        router.push(productsPagePath(businessId, returnCategory));
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
        back={{ label: translations.back }}
      >
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      </PageLayout>
    );
  }

  if (!product) return null;

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
