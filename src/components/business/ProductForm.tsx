"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import {
  ProductFormFields,
  type ProductFormValues,
} from "@/components/business/ProductFormFields";
import { Button } from "@/components/ui/button";
import { useProductCategories } from "@/hooks/useProductCategories";
import { useAppSelector } from "@/presentation/state/hooks";
import {
  createDefaultProductFormValues,
  hasProductFormChanges,
  productToFormValues,
  validateProductFormValues,
} from "@/utils/productForm";
import { resolveCategoryForApi } from "@/config/productCategories";
import type { Product, StockMaterial } from "@/types";
import { getProductDisplayImageUrl } from "@/utils/productImage";

export type { ProductFormValues };

interface ProductFormProps {
  businessId: number;
  initial?: Product;
  canUseStock?: boolean;
  availableMaterials?: StockMaterial[];
  submitting?: boolean;
  submitLabel: string;
  onSubmit: (
    values: ProductFormValues,
    meta: { categoryLabel: string }
  ) => void | Promise<void>;
  onCancel?: () => void;
  onDirtyChange?: (dirty: boolean) => void;
}

export function ProductForm({
  businessId,
  initial,
  canUseStock = false,
  availableMaterials = [],
  submitting,
  submitLabel,
  onSubmit,
  onCancel,
  onDirtyChange,
}: ProductFormProps) {
  const { translations, language, currency } = useAppSelector((s) => s.user);
  const lang = (language === "en" ? "en" : "tr") as "en" | "tr";
  const {
    groups,
    apiGroups,
    loading: categoriesLoading,
    createCustomCategory,
  } = useProductCategories(businessId, lang);

  const [values, setValues] = useState<ProductFormValues>(() =>
    initial ? productToFormValues(initial, []) : createDefaultProductFormValues()
  );
  const baselineRef = useRef<ProductFormValues | null>(null);
  const createBaselineRef = useRef<ProductFormValues>(createDefaultProductFormValues());
  const initializedFromApi = useRef(false);
  const [baselineVersion, setBaselineVersion] = useState(0);

  useEffect(() => {
    if (!initial || categoriesLoading || initializedFromApi.current) return;
    const baseline = productToFormValues(initial, apiGroups);
    baselineRef.current = baseline;
    setValues(baseline);
    initializedFromApi.current = true;
    setBaselineVersion((version) => version + 1);
  }, [initial, apiGroups, categoriesLoading]);

  const isDirty = useMemo(() => {
    if (initial) {
      if (!baselineRef.current) return false;
      return hasProductFormChanges(baselineRef.current, values);
    }
    return hasProductFormChanges(createBaselineRef.current, values);
  }, [initial, values, baselineVersion]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const patchValues = (patch: Partial<ProductFormValues>) => {
    setValues((prev) => ({ ...prev, ...patch }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProductFormValues(values)) {
      toast.error(translations.pleaseFillAllFields);
      return;
    }

    if (values.isCustomCategory && values.customCategory.trim()) {
      try {
        await createCustomCategory(values.customCategory.trim());
      } catch (err) {
        toast.error((err as Error).message || translations.createFailed);
        return;
      }
    }

    const categoryLabel = resolveCategoryForApi(values, lang, apiGroups);
    await onSubmit(values, { categoryLabel });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ProductFormFields
        values={values}
        onChange={patchValues}
        translations={translations}
        language={lang}
        currency={currency || "TRY"}
        businessId={businessId}
        canUseStock={canUseStock}
        availableMaterials={availableMaterials}
        existingImageUrl={getProductDisplayImageUrl(initial)}
        idPrefix={initial ? "edit-product" : "create-product"}
        categoryGroups={groups}
        apiGroups={apiGroups}
        categoriesLoading={categoriesLoading}
      />

      <div className="flex justify-end gap-3 border-t border-border/60 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
            {translations.cancel}
          </Button>
        )}
        <Button type="submit" loading={submitting} disabled={categoriesLoading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
