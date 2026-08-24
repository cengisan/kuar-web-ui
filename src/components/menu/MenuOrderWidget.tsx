"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import type { OrderProductOption, TableOption } from "@/types/menu";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string | null;
}

interface MenuOrderWidgetProps {
  menuId: string;
  orderToken: string;
  tables: TableOption[];
  orderProducts: OrderProductOption[];
  apiBaseUrl: string;
}

type OrderStep = "cart" | "table" | "success";

export function MenuOrderWidget({
  menuId,
  orderToken,
  tables,
  orderProducts,
  apiBaseUrl,
}: MenuOrderWidgetProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<OrderStep>("cart");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const addToCart = useCallback((product: OrderProductOption) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          category: product.category,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === productId);
      if (!existing) return prev;
      if (existing.quantity === 1) return prev.filter((i) => i.id !== productId);
      return prev.map((i) =>
        i.id === productId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  }, []);

  const getQuantity = (productId: number) =>
    cart.find((i) => i.id === productId)?.quantity ?? 0;

  const handleSubmit = async () => {
    if (!selectedTable) {
      setError("Lütfen bir masa seçin.");
      return;
    }
    if (cart.length === 0) {
      setError("Sepetiniz boş.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        token: orderToken,
        table_id: Number(selectedTable),
        customer_note: note.trim() || null,
        items: cart.map((i) => ({ product_id: i.id, quantity: i.quantity })),
      };
      const res = await fetch(`${apiBaseUrl}/menu/${menuId}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          message?: string;
          validation_error?: string[];
          meta?: { message?: string };
        };
        const validationMsg = Array.isArray(body.validation_error)
          ? body.validation_error.join(", ")
          : null;
        throw new Error(validationMsg ?? body.meta?.message ?? body.message ?? "Sipariş oluşturulamadı.");
      }
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setOpen(false);
    setStep("cart");
    setCart([]);
    setSelectedTable("");
    setNote("");
    setError(null);
  };

  return (
    <>
      {/* Floating cart button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-white font-semibold shadow-2xl transition-transform active:scale-95"
        style={{ background: "var(--order-accent, #22c55e)" }}
        aria-label="Siparişi görüntüle"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
        {totalItems > 0 && (
          <span className="text-sm">
            {totalItems} ürün · {totalPrice.toFixed(2)}
          </span>
        )}
        {totalItems === 0 && <span className="text-sm">Sipariş ver</span>}
      </button>

      {/* Drawer overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          onClick={(e) => e.target === e.currentTarget && resetAndClose()}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetAndClose} />
          <div
            className="relative z-10 w-full max-w-lg rounded-t-3xl"
            style={{
              background: "var(--order-surface, #1e1e2e)",
              color: "var(--order-text, #f1f5f9)",
              maxHeight: "85svh",
              overflowY: "auto",
            }}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-white/20" />
            </div>

            {step === "success" ? (
              <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full text-3xl"
                  style={{ background: "var(--order-accent, #22c55e)" }}
                >
                  ✓
                </div>
                <h2 className="text-xl font-bold">Siparişiniz Alındı!</h2>
                <p className="text-sm opacity-70">
                  Siparişiniz mutfağa iletildi. Afiyet olsun 🍽
                </p>
                <button
                  onClick={resetAndClose}
                  className="mt-2 rounded-full px-8 py-3 font-semibold text-white"
                  style={{ background: "var(--order-accent, #22c55e)" }}
                >
                  Kapat
                </button>
              </div>
            ) : step === "table" ? (
              <div className="flex flex-col gap-4 px-6 pb-8 pt-4">
                <div className="flex items-center gap-3">
                  <button onClick={() => setStep("cart")} className="opacity-60 hover:opacity-100">
                    ←
                  </button>
                  <h2 className="text-lg font-bold">Masa ve Not Seç</h2>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium opacity-80">
                    Masa <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value)}
                    className="w-full rounded-xl border px-4 py-3 text-sm"
                    style={{
                      background: "var(--order-input, rgba(255,255,255,0.08))",
                      borderColor: "rgba(255,255,255,0.15)",
                      color: "inherit",
                    }}
                  >
                    <option value="">Masa seçin...</option>
                    {tables.map((t) => (
                      <option key={t.id} value={String(t.id)}>
                        {t.tableNumber}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium opacity-80">Not (isteğe bağlı)</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Özel istek veya allerjen notu..."
                    rows={3}
                    className="w-full resize-none rounded-xl border px-4 py-3 text-sm"
                    style={{
                      background: "var(--order-input, rgba(255,255,255,0.08))",
                      borderColor: "rgba(255,255,255,0.15)",
                      color: "inherit",
                    }}
                  />
                </div>

                {error && (
                  <p className="rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-400">{error}</p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full rounded-full py-3.5 font-bold text-white transition-opacity disabled:opacity-60"
                  style={{ background: "var(--order-accent, #22c55e)" }}
                >
                  {submitting ? "Gönderiliyor..." : `Siparişi Onayla · ${totalPrice.toFixed(2)}`}
                </button>
              </div>
            ) : (
              /* Cart step */
              <div className="flex flex-col gap-4 px-4 pb-8 pt-4">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-lg font-bold">Sepet</h2>
                  <button onClick={resetAndClose} className="opacity-50 hover:opacity-100 text-xl">
                    ✕
                  </button>
                </div>

                {/* Product list */}
                <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: "40svh" }}>
                  {orderProducts.map((product) => {
                    const qty = getQuantity(product.id);
                    return (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 rounded-2xl px-4 py-3"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-semibold">{product.name}</p>
                          <p className="text-xs opacity-60">{product.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromCart(product.id)}
                            disabled={qty === 0}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold transition disabled:opacity-30"
                            style={{ background: "rgba(255,255,255,0.1)" }}
                          >
                            −
                          </button>
                          <span className="w-5 text-center text-sm font-semibold">{qty}</span>
                          <button
                            onClick={() => addToCart(product)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-white"
                            style={{ background: "var(--order-accent, #22c55e)" }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Cart summary */}
                {cart.length > 0 && (
                  <div
                    className="rounded-2xl px-4 py-3"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    <p className="text-sm font-medium opacity-70 mb-1">Seçilen Ürünler</p>
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm py-0.5">
                        <span className="opacity-80">
                          {item.quantity}× {item.name}
                        </span>
                        <span className="font-semibold">
                          {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="mt-2 flex justify-between border-t border-white/10 pt-2 font-bold">
                      <span>Toplam</span>
                      <span>{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {cart.length === 0 && (
                  <p className="text-center text-sm opacity-50 py-4">
                    Henüz ürün eklemediniz. Yukarıdan seçim yapabilirsiniz.
                  </p>
                )}

                <button
                  onClick={() => {
                    if (cart.length > 0) setStep("table");
                  }}
                  disabled={cart.length === 0}
                  className="w-full rounded-full py-3.5 font-bold text-white transition-opacity disabled:opacity-40"
                  style={{ background: "var(--order-accent, #22c55e)" }}
                >
                  Devam Et ({totalItems} ürün)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
