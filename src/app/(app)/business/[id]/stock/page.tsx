"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { Settings, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { StockPercentageBar } from "@/components/business/StockPercentageBar";
import StockRepositoryImpl from "@/data/repositories/StockRepositoryImpl";
import { useAppSelector } from "@/presentation/state/hooks";
import { getUnitLabel } from "@/utils/measurementUnits";
import type { Material, ProductStockItem, StockSummary } from "@/types";
import { cn } from "@/lib/cn";

type StockTab = "materials" | "products";

export default function StockPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const businessId = Number(params.id);
  const { translations, accessToken, language } = useAppSelector((s) => s.user);

  const [activeTab, setActiveTab] = useState<StockTab>("materials");
  const [materials, setMaterials] = useState<Material[]>([]);
  const [products, setProducts] = useState<ProductStockItem[]>([]);
  const [summary, setSummary] = useState<StockSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const repo = new StockRepositoryImpl(translations, accessToken);
      const [materialRes, productRes, summaryRes] = await Promise.all([
        repo.getMaterials(businessId),
        repo.getProductStock(businessId),
        repo.getStockSummary(businessId),
      ]);
      setMaterials((materialRes.data as Material[]) || []);
      setProducts((productRes.data as ProductStockItem[]) || []);
      setSummary((summaryRes.data as StockSummary) || null);
    } catch (e) {
      if (!(e as { sessionExpired?: boolean }).sessionExpired) {
        toast.error((e as Error).message);
      }
      setMaterials([]);
      setProducts([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [accessToken, businessId, translations]);

  useEffect(() => {
    load();
  }, [load]);

  const formatMaterialDate = (item: Material) => {
    const dateValue = item.last_modified_date || item.created_date;
    return dateValue ? new Date(dateValue).toLocaleString() : "-";
  };

  const lang = language === "en" ? "en" : "tr";

  return (
    <PageLayout
      back={{ label: translations.back, onClick: () => router.back() }}
      contentClassName="space-y-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{translations.stockManagement}</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="icon" aria-label={translations.stockAlertSettings}>
            <Link href={`/business/${businessId}/stock/alerts`}>
              <Settings className="size-4" />
            </Link>
          </Button>
          {activeTab === "materials" && (
            <Button asChild>
              <Link href={`/business/${businessId}/stock/create`}>
                <Plus className="size-4" />
                {translations.addMaterial}
              </Link>
            </Button>
          )}
        </div>
      </div>

      {summary && (
        <Card>
          <CardContent className="space-y-2 p-4">
            <p className="font-semibold">{translations.stockSummary}</p>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                {translations.materials}: {summary.total_materials}
              </span>
              <span className="text-destructive">
                {translations.lowStock}: {summary.low_stock_materials}
              </span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                {translations.products}: {summary.total_tracked_products}
              </span>
              <span className="text-destructive">
                {translations.lowStock}: {summary.low_stock_products}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex border-b border-border">
        {(["materials", "products"] as StockTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 border-b-2 py-3 text-sm font-semibold transition-colors",
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab === "materials"
              ? translations.materialStock
              : translations.productStock}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : activeTab === "materials" ? (
        materials.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            {translations.noMaterialsFound}
          </p>
        ) : (
          <div className="grid gap-3 pb-20">
            {materials.map((material) => (
              <Link
                key={material.id}
                href={`/business/${businessId}/stock/${material.id}/edit`}
                className="block"
              >
                <Card className="transition-colors hover:bg-muted/30">
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="flex-1 truncate font-semibold">{material.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {material.current_stock ?? 0}{" "}
                        {getUnitLabel(material.unit || "", lang)}
                      </p>
                    </div>
                    <StockPercentageBar percentage={material.stock_percentage} />
                    <p className="text-xs text-muted-foreground">
                      {translations.lastUpdated}: {formatMaterialDate(material)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )
      ) : products.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          {translations.noProductStockFound}
        </p>
      ) : (
        <div className="grid gap-3 pb-8">
          {products.map((product) => (
            <Card key={product.product_id}>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="flex-1 truncate font-semibold">
                    {product.product_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {product.stock_quantity != null
                      ? `${product.stock_quantity} ${translations.pieces}`
                      : translations.notSpecified}
                  </p>
                </div>
                {product.track_stock && product.stock_percentage != null && (
                  <StockPercentageBar percentage={product.stock_percentage} />
                )}
                {product.materials && product.materials.length > 0 && (
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {product.materials.map((material) => (
                      <li key={`${product.product_id}-${material.material_id}`}>
                        • {material.material_name}: {material.quantity}{" "}
                        {getUnitLabel(material.unit, lang)}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
