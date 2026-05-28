"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Upload, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { allergens, getAllergenLabel } from "@/config/allergens";
import { productCategoryGroups, type ProductLanguage } from "@/config/productCategories";
import { ProductMaterialSelector } from "@/components/business/ProductMaterialSelector";
import type { ProductMaterial, StockMaterial } from "@/types";

export interface ProductFormValues {
  name: string;
  description: string;
  categoryId: string;
  customCategory: string;
  isCustomCategory: boolean;
  price: string;
  discount: string;
  isAvailable: boolean;
  isNewItem: boolean;
  isCampaign: boolean;
  isFavorite: boolean;
  allergenIds: number[];
  stockQuantity: string;
  materials: ProductMaterial[];
  imageFile: File | null;
}

export interface ProductFormFieldsProps {
  values: ProductFormValues;
  onChange: (patch: Partial<ProductFormValues>) => void;
  translations: Record<string, string>;
  language: ProductLanguage;
  currency: string;
  businessId: number;
  canUseStock: boolean;
  availableMaterials?: StockMaterial[];
  existingImageUrl?: string | null;
  idPrefix?: string;
}

function FieldHint({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="text-xs leading-relaxed text-muted-foreground">{text}</p>;
}

function ToggleRow({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/80 bg-card/60 px-4 py-3">
      <Label htmlFor={id} className="cursor-pointer text-sm font-medium">
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export function ProductFormFields({
  values,
  onChange,
  translations,
  language,
  currency,
  businessId,
  canUseStock,
  availableMaterials = [],
  existingImageUrl,
  idPrefix = "product",
}: ProductFormFieldsProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const showDescription = values.name.trim().length > 0;

  useEffect(() => {
    if (!values.imageFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(values.imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [values.imageFile]);

  const displayImage = previewUrl || existingImageUrl || null;

  const categoryOptions = useMemo(
    () =>
      productCategoryGroups.map((group) => ({
        title: group.title[language],
        items: group.items.map((item) => ({
          id: item.id,
          label: item[language],
        })),
      })),
    [language]
  );

  const toggleAllergen = (allergenId: number, checked: boolean) => {
    const next = checked
      ? [...values.allergenIds, allergenId]
      : values.allergenIds.filter((id) => id !== allergenId);
    onChange({ allergenIds: next });
  };

  const handleDiscountChange = (raw: string) => {
    if (raw === "") {
      onChange({ discount: "" });
      return;
    }
    const num = parseFloat(raw.replace(",", "."));
    if (!Number.isNaN(num) && num >= 0 && num <= 100) {
      onChange({ discount: raw });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
        {/* Image */}
        <section className="flex h-full flex-col gap-4 rounded-2xl border border-border/80 bg-muted/20 p-4 lg:col-span-4">
          <div className="space-y-1">
            <Label htmlFor={`${idPrefix}-image`}>
              {translations.productImage}
            </Label>
            <FieldHint text={translations.productImageTooltip} />
          </div>

          <div className="flex min-h-28 flex-1 flex-col">
            {displayImage ? (
              <div className="relative flex flex-1 overflow-hidden rounded-xl border border-border">
                <img
                  src={displayImage}
                  alt=""
                  className="mx-auto h-full w-full max-w-[220px] object-cover"
                />
                <button
                  type="button"
                  onClick={() => onChange({ imageFile: null })}
                  className="absolute right-2 top-2 rounded-full bg-destructive p-1.5 text-white shadow-sm"
                  aria-label={translations.remove}
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : (
              <label
                htmlFor={`${idPrefix}-image-input`}
                className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border transition-colors hover:border-primary/50 hover:bg-muted/30"
              >
                <Upload className="size-6 text-muted-foreground" />
                <span className="mt-2 text-sm text-muted-foreground">
                  {translations.uploadImage}
                </span>
              </label>
            )}
          </div>

          <input
            id={`${idPrefix}-image-input`}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              onChange({ imageFile: file });
              e.target.value = "";
            }}
          />

          {displayImage && (
            <label
              htmlFor={`${idPrefix}-image-input`}
              className="inline-flex cursor-pointer text-sm font-medium text-primary hover:underline"
            >
              {translations.changeImage}
            </label>
          )}
        </section>

        {/* Core details */}
        <div className="flex h-full flex-col gap-4 lg:col-span-5">
          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-name`}>
              {translations.productName} *
            </Label>
            <FieldHint text={translations.productNameTooltip} />
            <Input
              id={`${idPrefix}-name`}
              value={values.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder={translations.enterProductName}
              required
              maxLength={100}
            />
          </div>

          {showDescription && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
              <Label htmlFor={`${idPrefix}-desc`}>
                {translations.description}
              </Label>
              <FieldHint text={translations.descriptionTooltip} />
              <Textarea
                id={`${idPrefix}-desc`}
                value={values.description}
                onChange={(e) => onChange({ description: e.target.value })}
                placeholder={translations.enterDescription}
                rows={3}
                maxLength={500}
              />
            </div>
          )}

          <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-border/80 bg-muted/20 p-4">
            <div className="space-y-1">
              <Label>{translations.category} *</Label>
              <FieldHint text={translations.categoryTooltip} />
            </div>

            {values.isCustomCategory ? (
              <Input
                id={`${idPrefix}-custom-category`}
                value={values.customCategory}
                onChange={(e) => onChange({ customCategory: e.target.value })}
                placeholder={translations.enterCategoryName}
                maxLength={50}
                required
              />
            ) : (
              <Select
                value={values.categoryId || undefined}
                onValueChange={(categoryId) => onChange({ categoryId })}
              >
                <SelectTrigger id={`${idPrefix}-category`}>
                  <SelectValue placeholder={translations.selectCategory} />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((group) => (
                    <SelectGroup key={group.title}>
                      <SelectLabel>{group.title}</SelectLabel>
                      {group.items.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            )}

            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={values.isCustomCategory}
                onCheckedChange={(checked) =>
                  onChange({
                    isCustomCategory: checked === true,
                    categoryId: checked ? "" : values.categoryId,
                    customCategory: checked ? values.customCategory : "",
                  })
                }
              />
              <span>{translations.createCustomCategory}</span>
            </label>
          </div>
        </div>

        {/* Flags sidebar */}
        <section className="flex h-full flex-col justify-between gap-3 rounded-2xl border border-border/80 bg-muted/20 p-4 lg:col-span-3">
          <ToggleRow
            id={`${idPrefix}-available`}
            label={translations.isProductAvailable}
            checked={values.isAvailable}
            onCheckedChange={(isAvailable) => onChange({ isAvailable })}
          />
          <ToggleRow
            id={`${idPrefix}-new`}
            label={translations.isNewItem}
            checked={values.isNewItem}
            onCheckedChange={(isNewItem) => onChange({ isNewItem })}
          />
          <ToggleRow
            id={`${idPrefix}-campaign`}
            label={translations.isCampaign}
            checked={values.isCampaign}
            onCheckedChange={(isCampaign) => onChange({ isCampaign })}
          />
          <ToggleRow
            id={`${idPrefix}-favorite`}
            label={translations.isFavorite}
            checked={values.isFavorite}
            onCheckedChange={(isFavorite) => onChange({ isFavorite })}
          />
        </section>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:items-stretch">
        <div className="flex h-full flex-col gap-2">
          <div className="flex-1 space-y-1">
            <Label htmlFor={`${idPrefix}-price`}>
              {translations.price} ({currency}) *
            </Label>
            <FieldHint text={translations.priceTooltip} />
          </div>
          <Input
            id={`${idPrefix}-price`}
            type="text"
            inputMode="decimal"
            value={values.price}
            onChange={(e) => onChange({ price: e.target.value })}
            placeholder={translations.enterPrice}
            required
            className="shrink-0"
          />
        </div>
        <div className="flex h-full flex-col gap-2">
          <div className="flex-1 space-y-1">
            <Label htmlFor={`${idPrefix}-discount`}>
              {translations.discount} (%)
            </Label>
            <FieldHint text={translations.discountTooltip} />
          </div>
          <div className="relative shrink-0">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
              %
            </span>
            <Input
              id={`${idPrefix}-discount`}
              type="text"
              inputMode="decimal"
              value={values.discount}
              onChange={(e) => handleDiscountChange(e.target.value)}
              placeholder={translations.enterDiscount}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      {/* Allergens */}
      <section className="space-y-3 rounded-2xl border border-border/80 bg-muted/20 p-4">
        <div className="space-y-1">
          <Label>{translations.allergens}</Label>
          <FieldHint text={translations.allergensTooltip} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {allergens.map((allergen) => (
            <label
              key={allergen.id}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-2 text-sm"
            >
              <Checkbox
                checked={values.allergenIds.includes(allergen.id)}
                onCheckedChange={(checked) =>
                  toggleAllergen(allergen.id, checked === true)
                }
              />
              <span>{getAllergenLabel(allergen, language)}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Stock */}
      <section
        className={`space-y-4 rounded-2xl border border-border/80 bg-muted/20 p-4 ${
          canUseStock ? "" : "opacity-70"
        }`}
      >
        <div className="space-y-1">
          <Label>{translations.stockInfo}</Label>
          <FieldHint
            text={
              canUseStock
                ? translations.stockInfoTooltip
                : translations.stockModuleRequiredMessage
            }
          />
        </div>

        {!canUseStock && (
          <p className="text-sm text-muted-foreground">
            {translations.stockModuleRequiredMessage}{" "}
            <Link
              href="/subscription"
              className="font-medium text-primary hover:underline"
            >
              {translations.subscription}
            </Link>
          </p>
        )}

        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-stock-qty`}>
            {translations.productQuantity}
          </Label>
          <Input
            id={`${idPrefix}-stock-qty`}
            type="text"
            inputMode="numeric"
            value={values.stockQuantity}
            onChange={(e) =>
              onChange({ stockQuantity: e.target.value.replace(/\D/g, "") })
            }
            placeholder={translations.productStockQuantity}
            disabled={!canUseStock}
          />
        </div>

        <ProductMaterialSelector
          materials={availableMaterials}
          selectedMaterials={values.materials}
          onChange={(materials) => onChange({ materials })}
          translations={translations}
          language={language}
          businessId={businessId}
          disabled={!canUseStock}
        />
      </section>
    </div>
  );
}
