"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { Search, Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import ProductRepositoryImpl from "@/data/repositories/ProductRepositoryImpl";
import OrderRepositoryImpl from "@/data/repositories/OrderRepositoryImpl";
import { useAppSelector } from "@/presentation/state/hooks";
import { getResponseData } from "@/utils/apiResponse";
import type { Product } from "@/types";

export default function OrderProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ id: string; tableId: string }>();
  const businessId = Number(params.id);
  const tableId = Number(params.tableId);
  const initialOrderId = searchParams.get("orderId");
  const { translations, accessToken, currency } = useAppSelector((s) => s.user);

  const [currentOrderId, setCurrentOrderId] = useState<number | null>(
    initialOrderId ? Number(initialOrderId) : null
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!accessToken) return;
      try {
        const repo = new ProductRepositoryImpl(translations, accessToken);
        const response = await repo.getProducts(businessId);
        const list = getResponseData<Product[]>(response) || [];
        setProducts(list.filter((p) => p.is_available !== false));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [accessToken, businessId, translations]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }, [products, query]);

  const incQty = (productId: number) => {
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const decQty = (productId: number) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      if (current <= 1) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: current - 1 };
    });
  };

  const cartTotal = useMemo(() => {
    return Object.entries(cart).reduce((sum, [pid, qty]) => {
      const product = products.find((p) => p.id === Number(pid));
      return sum + (product?.price || 0) * qty;
    }, 0);
  }, [cart, products]);

  const cartCount = useMemo(
    () => Object.values(cart).reduce((s, q) => s + q, 0),
    [cart]
  );

  const handleSubmit = useCallback(async () => {
    if (!accessToken || cartCount === 0) return;
    setSubmitting(true);
    try {
      const orderRepo = new OrderRepositoryImpl(translations, accessToken);
      let orderId = currentOrderId;

      if (!orderId) {
        const existing = await orderRepo.getActiveOrderByTable(tableId);
        orderId = existing.success && existing.order ? existing.order.id : null;
      }

      if (!orderId) {
        const r = await orderRepo.createOrder({ tableId });
        if (!r.success || !r.order) {
          toast.error(r.message || translations.createFailed);
          return;
        }
        orderId = r.order.id;
        setCurrentOrderId(orderId);
      }

      for (const [pid, qty] of Object.entries(cart)) {
        const addResult = await orderRepo.addItemToOrder(orderId, {
          productId: Number(pid),
          quantity: qty,
        });
        if (!addResult.success) {
          toast.error(addResult.message || translations.createFailed);
          return;
        }
      }

      toast.success(translations.orderSent);
      router.replace(`/business/${businessId}/tables/${tableId}/order`);
    } finally {
      setSubmitting(false);
    }
  }, [accessToken, businessId, cart, cartCount, currentOrderId, router, tableId, translations]);

  return (
    <PageLayout
      back={{ label: translations.back, onClick: () => router.back() }}
      contentClassName="space-y-6"
    ><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">{translations.selectProducts}</h1>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={translations.search}
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => {
            const qty = cart[product.id] || 0;
            return (
              <Card key={product.id}>
                <CardContent className="flex items-center gap-3 p-3">
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-semibold">{product.name}</p>
                    <p className="text-sm font-bold text-primary">
                      {product.price?.toFixed(2)} {currency}
                    </p>
                  </div>
                  {qty > 0 ? (
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="outline" onClick={() => decQty(product.id)}>
                        <Minus />
                      </Button>
                      <Badge className="min-w-[2rem] justify-center">{qty}</Badge>
                      <Button size="icon" variant="outline" onClick={() => incQty(product.id)}>
                        <Plus />
                      </Button>
                    </div>
                  ) : (
                    <Button size="icon" onClick={() => incQty(product.id)}>
                      <Plus />
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {cartCount > 0 && (
        <div className="sticky bottom-4 z-10">
          <Card className="border-primary">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">
                    {cartCount} {translations.items}
                  </p>
                  <p className="text-lg font-bold text-primary">
                    {cartTotal.toFixed(2)} {currency}
                  </p>
                </div>
              </div>
              <Button onClick={handleSubmit} loading={submitting}>
                {translations.sendOrder || translations.orderSent}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </PageLayout>
  );
}
