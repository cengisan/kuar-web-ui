"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  ProductFormFields,
  type ProductFormValues,
} from "@/components/business/ProductFormFields";
import { useAppSelector } from "@/presentation/state/hooks";
import {
  createDefaultProductFormValues,
  productToFormValues,
  validateProductFormValues,
} from "@/utils/productForm";
import type { Product, StockMaterial } from "@/types";

export type { ProductFormValues };

function getProductImageUrl(product?: Partial<Product>) {
  const image =
    product?.product_image?.[0] || product?.images?.[0];
  return image?.image_url || image?.url || null;
}

interface ProductFormProps {
  businessId: number;
  initial?: Product;
  canUseStock?: boolean;
  availableMaterials?: StockMaterial[];
  submitting?: boolean;
  submitLabel: string;
  onSubmit: (values: ProductFormValues) => void | Promise<void>;
  onCancel?: () => void;
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
}: ProductFormProps) {
  const { translations, language, currency } = useAppSelector((s) => s.user);
  const lang = (language === "en" ? "en" : "tr") as "en" | "tr";

  const [values, setValues] = useState<ProductFormValues>(() =>
    initial ? productToFormValues(initial) : createDefaultProductFormValues()
  );

  const patchValues = (patch: Partial<ProductFormValues>) => {
    setValues((prev) => ({ ...prev, ...patch }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProductFormValues(values)) {
      toast.error(translations.pleaseFillAllFields);
      return;
    }
    await onSubmit(values);
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
        existingImageUrl={getProductImageUrl(initial)}
        idPrefix={initial ? "edit-product" : "create-product"}
      />

      <div className="flex justify-end gap-3 border-t border-border/60 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
            {translations.cancel}
          </Button>
        )}
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
