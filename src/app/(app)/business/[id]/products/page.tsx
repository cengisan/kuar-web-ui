"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import {
  Plus,
  Package,
  Pencil,
  Trash2,
  Search,
  X,
  ChevronLeft,
  FolderOpen,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ProductRepositoryImpl from "@/data/repositories/ProductRepositoryImpl";
import { useAppSelector } from "@/presentation/state/hooks";
import { getResponseData, isActionSuccess } from "@/utils/apiResponse";
import { getProductCategoryDisplay } from "@/config/productCategories";
import { getProductDisplayImageUrl } from "@/utils/productImage";
import type { Product } from "@/types";

export default function ProductsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const businessId = Number(params.id);
  const { translations, accessToken, currency, language } = useAppSelector(
    (s) => s.user
  );
  const lang = language === "en" ? "en" : "tr";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    if (!accessToken) return;
    try {
      const repo = new ProductRepositoryImpl(translations, accessToken);
      const response = await repo.getProducts(businessId);
      const data = getResponseData<Product[]>(response);
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken, businessId, translations]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categoriesWithCounts = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((product) => {
      if (!product.category) return;
      counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
    });

    return Array.from(counts.entries())
      .map(([id, count]) => ({
        id,
        label: getProductCategoryDisplay(id, lang),
        count,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, lang === "tr" ? "tr" : "en"));
  }, [products, lang]);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return [];

    let list = products.filter((product) => product.category === selectedCategory);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((product) =>
        (product.name?.toLowerCase() || "").includes(q)
      );
    }
    return list;
  }, [products, query, selectedCategory]);

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setQuery("");
  };

  const handleDelete = async () => {
    if (!deleteTarget || !accessToken) return;
    setDeleting(true);
    try {
      const repo = new ProductRepositoryImpl(translations, accessToken);
      const result = await repo.deleteProduct(deleteTarget.id);
      if (isActionSuccess(result)) {
        toast.success(translations.productDeleted);
        setDeleteTarget(null);
        fetchProducts();
      } else {
        toast.error(
          (result as { message?: string })?.message || translations.error
        );
      }
    } finally {
      setDeleting(false);
    }
  };

  const selectedCategoryLabel = selectedCategory
    ? getProductCategoryDisplay(selectedCategory, lang)
    : "";

  return (
    <PageLayout
      back={{ label: translations.back, onClick: () => router.back() }}
      contentClassName="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">
            {selectedCategory ? selectedCategoryLabel : translations.categories}
          </h1>
          {selectedCategory && (
            <button
              type="button"
              onClick={handleBackToCategories}
              className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="size-4" />
              {translations.categories}
            </button>
          )}
        </div>
        <Button asChild className="shrink-0">
          <Link href={`/business/${businessId}/products/create`}>
            <Plus />
            {translations.createProduct}
          </Link>
        </Button>
      </div>

      {selectedCategory && (
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={translations.searchByName}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {query.length > 0 && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setQuery("")}
              aria-label={translations.cancel}
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : !selectedCategory ? (
        categoriesWithCounts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-semibold">
              {translations.pleaseAddProduct}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoriesWithCounts.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className="text-left"
              >
                <Card className="h-full transition-colors hover:border-primary/40 hover:bg-muted/20">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15">
                      <FolderOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{category.label}</p>
                    </div>
                    <Badge variant="secondary">{category.count}</Badge>
                    <ChevronLeft className="size-5 rotate-180 text-muted-foreground" />
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        )
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold">
            {query.trim()
              ? translations.noResultsFound
              : translations.noProductsFound}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const firstImage = getProductDisplayImageUrl(product);
            return (
              <Card key={product.id} className="overflow-hidden">
                {firstImage ? (
                  <img
                    src={firstImage}
                    alt={product.name}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center bg-muted">
                    <Package className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{product.name}</p>
                    </div>
                    <Badge
                      variant={product.is_available ? "success" : "secondary"}
                    >
                      {product.is_available
                        ? translations.productAvailable
                        : translations.productNotAvailable}
                    </Badge>
                  </div>
                  <p className="text-lg font-bold text-primary">
                    {product.price?.toFixed(2)} {product.currency || currency}
                  </p>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link
                        href={`/business/${businessId}/products/${product.id}/edit`}
                      >
                        <Pencil />
                        {translations.edit}
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleteTarget(product)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {translations.confirmationDeleteProductMessage}
            </DialogTitle>
            <DialogDescription>{deleteTarget?.name}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              {translations.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              loading={deleting}
            >
              {translations.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
