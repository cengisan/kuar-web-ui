"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AtSign, Expand, Upload, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getMenuThemePreviewImage,
  menuCurrencies,
  menuThemeOptions,
} from "@/config/menuFormOptions";

export interface MenuFormValues {
  name: string;
  businessName: string;
  instagramUsername: string;
  currency: string;
  theme: string;
  isAvailable: boolean;
}

export interface MenuFormFieldsProps {
  values: MenuFormValues;
  onChange: (patch: Partial<MenuFormValues>) => void;
  translations: Record<string, string>;
  imageFile?: File | null;
  onImageChange?: (file: File | null) => void;
  existingImageUrl?: string | null;
  idPrefix?: string;
}

function FieldHint({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="text-xs leading-relaxed text-muted-foreground">{text}</p>;
}

export function MenuFormFields({
  values,
  onChange,
  translations,
  imageFile,
  onImageChange,
  existingImageUrl,
  idPrefix = "menu",
}: MenuFormFieldsProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [themePreviewOpen, setThemePreviewOpen] = useState(false);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const displayImage = previewUrl || existingImageUrl || null;

  const themeLabel = useMemo(
    () => menuThemeOptions.find((t) => t.value === values.theme)?.label ?? values.theme,
    [values.theme]
  );

  const themePreviewImage = useMemo(
    () => getMenuThemePreviewImage(values.theme),
    [values.theme]
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        {/* Branding */}
        <section className="space-y-4 rounded-2xl border border-border/80 bg-muted/20 p-4 lg:col-span-4">
          <div className="space-y-1">
            <Label htmlFor={`${idPrefix}-image`}>
              {translations.menuImage}
            </Label>
            <FieldHint text={translations.menuImageTooltip} />
          </div>

          {displayImage ? (
            <div className="relative overflow-hidden rounded-xl border border-border">
              <img
                src={displayImage}
                alt=""
                className="mx-auto h-36 w-full max-w-[200px] object-contain bg-muted/30 lg:h-40"
              />
              {onImageChange && (
                <button
                  type="button"
                  onClick={() => onImageChange(null)}
                  className="absolute right-2 top-2 rounded-full bg-destructive p-1.5 text-white shadow-sm"
                  aria-label={translations.remove}
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          ) : (
            <label
              htmlFor={`${idPrefix}-image-input`}
              className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border transition-colors hover:border-primary/50 hover:bg-muted/30 lg:h-36"
            >
              <Upload className="size-6 text-muted-foreground" />
              <span className="mt-2 text-sm text-muted-foreground">
                {translations.uploadImage}
              </span>
            </label>
          )}

          {onImageChange && (
            <>
              <input
                id={`${idPrefix}-image-input`}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  onImageChange(file);
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
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-business-name`}>
              {translations.businessName}
            </Label>
            <FieldHint text={translations.businessNameTooltip} />
            <Input
              id={`${idPrefix}-business-name`}
              value={values.businessName}
              onChange={(e) => onChange({ businessName: e.target.value })}
              placeholder={translations.enterBusinessName}
              maxLength={100}
            />
          </div>
        </section>

        {/* Menu details */}
        <div className="space-y-4 lg:col-span-5">
          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-name`}>
              {translations.menuName} *
            </Label>
            <FieldHint text={translations.menuNameTooltip} />
            <Input
              id={`${idPrefix}-name`}
              value={values.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder={translations.enterMenuName}
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-instagram`}>
              {translations.socialMedia}
            </Label>
            <FieldHint text={translations.instagramTooltip} />
            <div className="relative">
              <AtSign className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id={`${idPrefix}-instagram`}
                value={values.instagramUsername}
                onChange={(e) => onChange({ instagramUsername: e.target.value })}
                placeholder={translations.enterInstagramUsername}
                className="pl-9"
                maxLength={64}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{translations.currency}</Label>
              <FieldHint text={translations.currencyTooltip} />
              <Select value={values.currency} onValueChange={(currency) => onChange({ currency })}>
                <SelectTrigger>
                  <SelectValue placeholder={translations.currency} />
                </SelectTrigger>
                <SelectContent>
                  {menuCurrencies.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 lg:hidden">
              <Label>{translations.selectMenuTheme}</Label>
              <FieldHint text={translations.menuThemeTooltip} />
              <Select value={values.theme} onValueChange={(theme) => onChange({ theme })}>
                <SelectTrigger>
                  <SelectValue placeholder={translations.selectMenuTheme} />
                </SelectTrigger>
                <SelectContent>
                  {menuThemeOptions.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border/80 bg-card/60 px-4 py-3 lg:hidden">
            <Label htmlFor={`${idPrefix}-available-mobile`} className="cursor-pointer">
              {translations.isAvailable}
            </Label>
            <Switch
              id={`${idPrefix}-available-mobile`}
              checked={values.isAvailable}
              onCheckedChange={(isAvailable) => onChange({ isAvailable })}
            />
          </div>
        </div>

        {/* Theme preview (desktop sidebar) */}
        <section className="space-y-3 rounded-2xl border border-border/80 bg-muted/20 p-4 lg:col-span-3 lg:sticky lg:top-4">
          <div className="hidden space-y-2 lg:block">
            <Label>{translations.selectMenuTheme}</Label>
            <FieldHint text={translations.menuThemeTooltip} />
            <Select value={values.theme} onValueChange={(theme) => onChange({ theme })}>
              <SelectTrigger>
                <SelectValue placeholder={translations.selectMenuTheme} />
              </SelectTrigger>
              <SelectContent>
                {menuThemeOptions.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground lg:sr-only">
              {translations.selectMenuTheme}
            </p>
            <div className="relative overflow-hidden rounded-xl border border-border/80 bg-background/50">
              <Image
                src={themePreviewImage}
                alt={themeLabel}
                className="mx-auto h-48 w-full object-contain lg:h-56"
                sizes="(max-width: 1024px) 260px, 280px"
                priority
              />
              <button
                type="button"
                onClick={() => setThemePreviewOpen(true)}
                className="absolute right-2 top-2 rounded-lg border border-border/60 bg-background/90 p-1.5 text-foreground shadow-sm transition-colors hover:bg-background"
                aria-label={translations.view}
              >
                <Expand className="size-3.5" />
              </button>
            </div>
          </div>

          <div className="hidden items-center justify-between rounded-xl border border-border/80 bg-card/60 px-4 py-3 lg:flex">
            <Label htmlFor={`${idPrefix}-available`} className="cursor-pointer text-sm">
              {translations.isAvailable}
            </Label>
            <Switch
              id={`${idPrefix}-available`}
              checked={values.isAvailable}
              onCheckedChange={(isAvailable) => onChange({ isAvailable })}
            />
          </div>
        </section>
      </div>

      <Dialog open={themePreviewOpen} onOpenChange={setThemePreviewOpen}>
        <DialogContent className="flex max-h-[92vh] w-[min(100vw-2rem,28rem)] flex-col overflow-hidden p-4 sm:p-6">
          <DialogHeader className="shrink-0 pr-8">
            <DialogTitle>{themeLabel}</DialogTitle>
          </DialogHeader>
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden py-1">
            <Image
              src={themePreviewImage}
              alt={themeLabel}
              width={themePreviewImage.width}
              height={themePreviewImage.height}
              className="mx-auto h-auto max-h-[calc(92vh-6.5rem)] w-auto max-w-full rounded-lg object-contain"
              sizes="448px"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
