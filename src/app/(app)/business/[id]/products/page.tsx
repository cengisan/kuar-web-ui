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
  Filter,
  ChevronDown,
  ChevronUp,
  X,
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
import { cn } from "@/lib/cn";
import type { Product } from "@/types";

const ALL_CATEGORIES = "all";

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
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [showFilters, setShowFilters] = useState(false);
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

  const categoryOptions = useMemo(() => {
    const unique = new Set<string>();
    products.forEach((p) => {
      if (p.category) unique.add(p.category);
    });
    return Array.from(unique).sort((a, b) =>
      getProductCategoryDisplay(a, lang).localeCompare(
        getProductCategoryDisplay(b, lang),
        lang === "tr" ? "tr" : "en"
      )
    );
  }, [products, lang]);

  const filtered = useMemo(() => {
    let list = products;

    if (selectedCategory !== ALL_CATEGORIES) {
      list = list.filter((p) => p.category === selectedCategory);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => {
        const name = p.name?.toLowerCase() || "";
        const categoryRaw = p.category?.toLowerCase() || "";
        const categoryLabel = getProductCategoryDisplay(p.category, lang).toLowerCase();
        return (
          name.includes(q) ||
          categoryRaw.includes(q) ||
          categoryLabel.includes(q)
        );
      });
    }

    return list;
  }, [products, query, selectedCategory, lang]);

  const hasActiveFilters =
    selectedCategory !== ALL_CATEGORIES || query.trim().length > 0;

  const clearFilters = () => {
    setQuery("");
    setSelectedCategory(ALL_CATEGORIES);
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

  return (
    <PageLayout
      back={{ label: translations.back, onClick: () => router.back() }}
      contentClassName="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">{translations.products}</h1>
        <Button asChild className="shrink-0">
          <Link href={`/business/${businessId}/products/create`}>
            <Plus />
            {translations.createProduct}
          </Link>
        </Button>
      </div>

      <Card className="border-border/80 shadow-card">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 p-4 text-left"
          onClick={() => setShowFilters((open) => !open)}
        >
          <div className="flex items-center gap-2 font-medium">
            <Filter className="size-4" />
            {translations.filter}
            {hasActiveFilters && (
              <Badge variant="secondary" className="text-xs">
                {filtered.length}
              </Badge>
            )}
          </div>
          {showFilters ? (
            <ChevronUp className="size-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-5 text-muted-foreground" />
          )}
        </button>

        {showFilters && (
          <CardContent className="space-y-4 border-t border-border pt-4">
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

            <div className="space-y-2">
              <p className="text-sm font-medium">{translations.categories}</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(ALL_CATEGORIES)}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    selectedCategory === ALL_CATEGORIES
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:bg-muted/50"
                  )}
                >
                  {translations.all}
                </button>
                {categoryOptions.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                      selectedCategory === category
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:bg-muted/50"
                    )}
                  >
                    {getProductCategoryDisplay(category, lang)}
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearFilters}
              >
                {translations.cancel}
              </Button>
            )}
          </CardContent>
        )}
      </Card>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold">
            {translations.noProductsFound}
          </p>
          {hasActiveFilters && products.length > 0 && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={clearFilters}
            >
              {translations.cancel}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => {
            const firstImage =
              product.images?.[0]?.image_url || product.images?.[0]?.url;
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
                      {product.category && (
                        <p className="truncate text-xs text-muted-foreground">
                          {getProductCategoryDisplay(product.category, lang)}
                        </p>
                      )}
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
