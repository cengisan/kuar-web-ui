"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  formatCardNumberInput,
  PaymentCardPreview,
} from "@/components/subscription/PaymentCardPreview";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProfileRepositoryImpl from "@/data/repositories/ProfileRepositoryImpl";
import SubscriptionRepositoryImpl from "@/data/repositories/SubscriptionRepositoryImpl";
import type { Translations } from "@/types";
import type { AvailableModule } from "@/utils/subscription";
import { formatMoney } from "@/utils/subscription";

interface SubscriptionPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscriberId: number;
  accessToken: string;
  translations: Translations;
  selectedModules: AvailableModule[];
  moduleQuantities: Record<number, number>;
  totalAmount: number;
  currency?: string;
  onSuccess: () => void;
}

export function SubscriptionPaymentDialog({
  open,
  onOpenChange,
  subscriberId,
  accessToken,
  translations,
  selectedModules,
  moduleQuantities,
  totalAmount,
  currency = "TRY",
  onSuccess,
}: SubscriptionPaymentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    card_holder_name: "",
    card_number: "",
    expire_month: "",
    expire_year: "",
    cvc: "",
  });
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    identity_number: "",
    billing_address: "",
    city: "",
    zipcode: "",
    country: "Türkiye",
  });

  useEffect(() => {
    if (!open || !accessToken || !subscriberId) return;
    const loadProfile = async () => {
      try {
        const repo = new ProfileRepositoryImpl(translations, accessToken);
        const response = await repo.getProfile(subscriberId);
        const data = response?.data as Record<string, string> | undefined;
        if (data) {
          setCustomerInfo((prev) => ({
            ...prev,
            name: data.name?.split(" ")[0] || prev.name,
            surname: data.name?.split(" ").slice(1).join(" ") || prev.surname,
            email: data.email || prev.email,
            phone: data.msisdn || prev.phone,
          }));
        }
      } catch {
        /* optional prefill */
      }
    };
    loadProfile();
  }, [open, accessToken, subscriberId, translations]);

  const isFormValid = () => {
    const cardNumber = paymentInfo.card_number.replace(/\s/g, "");
    const emailValid = customerInfo.email.trim() !== "";
    return (
      paymentInfo.card_holder_name.trim() !== "" &&
      cardNumber.length === 16 &&
      paymentInfo.expire_month.trim() !== "" &&
      paymentInfo.expire_year.trim() !== "" &&
      paymentInfo.cvc.length === 3 &&
      customerInfo.name.trim() !== "" &&
      customerInfo.surname.trim() !== "" &&
      emailValid &&
      customerInfo.phone.trim() !== "" &&
      customerInfo.billing_address.trim() !== "" &&
      customerInfo.city.trim() !== "" &&
      customerInfo.zipcode.trim() !== ""
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast.error(translations.pleaseFillAllFields);
      return;
    }

    setLoading(true);
    try {
      const repo = new SubscriptionRepositoryImpl(translations, accessToken);
      let expireYear = paymentInfo.expire_year;
      if (expireYear.length === 2) {
        expireYear = `20${expireYear}`;
      }

      const quantitiesMap: Record<number, number> = {};
      selectedModules.forEach((module) => {
        if (moduleQuantities[module.module_id]) {
          quantitiesMap[module.module_id] = moduleQuantities[module.module_id];
        }
      });

      await repo.purchaseModules({
        subscriber_id: subscriberId,
        module_ids: selectedModules.map((m) => m.module_id),
        module_quantities: Object.keys(quantitiesMap).length > 0 ? quantitiesMap : undefined,
        payment_info: {
          card_holder_name: paymentInfo.card_holder_name.trim(),
          card_number: paymentInfo.card_number.replace(/\s/g, ""),
          expire_month: paymentInfo.expire_month,
          expire_year: expireYear,
          cvc: paymentInfo.cvc,
        },
        customer_info: customerInfo,
      });

      onOpenChange(false);
      onSuccess();
    } catch (e) {
      toast.error((e as Error).message || translations.paymentFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{translations.paymentDetails}</DialogTitle>
        </DialogHeader>

        <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {translations.total}
          </p>
          <p className="text-2xl font-bold tabular-nums">{formatMoney(totalAmount, currency)}</p>
        </div>

        <div className="space-y-4">
          <PaymentCardPreview
            cardNumber={paymentInfo.card_number}
            cardHolderName={paymentInfo.card_holder_name}
            expireMonth={paymentInfo.expire_month}
            expireYear={paymentInfo.expire_year}
            cvc={paymentInfo.cvc}
            holderPlaceholder={
              translations.cardHolderNamePlaceholder
            }
            monthPlaceholder={translations.expireMonthPlaceholder}
            yearPlaceholder={translations.expireYearPlaceholder}
            cvcPlaceholder={translations.cvcPlaceholder}
          />

          <div className="space-y-2">
            <Label>{translations.cardHolderName}</Label>
            <Input
              value={paymentInfo.card_holder_name}
              onChange={(e) =>
                setPaymentInfo((p) => ({ ...p, card_holder_name: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>{translations.cardNumber}</Label>
            <Input
              value={paymentInfo.card_number}
              onChange={(e) =>
                setPaymentInfo((p) => ({
                  ...p,
                  card_number: formatCardNumberInput(e.target.value),
                }))
              }
              inputMode="numeric"
              maxLength={19}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>{translations.expireMonth}</Label>
              <Input
                value={paymentInfo.expire_month}
                onChange={(e) =>
                  setPaymentInfo((p) => ({
                    ...p,
                    expire_month: e.target.value.replace(/\D/g, "").slice(0, 2),
                  }))
                }
                placeholder="MM"
              />
            </div>
            <div className="space-y-2">
              <Label>{translations.expireYear}</Label>
              <Input
                value={paymentInfo.expire_year}
                onChange={(e) =>
                  setPaymentInfo((p) => ({
                    ...p,
                    expire_year: e.target.value.replace(/\D/g, "").slice(0, 4),
                  }))
                }
                placeholder="YYYY"
              />
            </div>
            <div className="space-y-2">
              <Label>CVC</Label>
              <Input
                value={paymentInfo.cvc}
                onChange={(e) =>
                  setPaymentInfo((p) => ({
                    ...p,
                    cvc: e.target.value.replace(/\D/g, "").slice(0, 3),
                  }))
                }
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{translations.name}</Label>
              <Input
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo((c) => ({ ...c, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>{translations.surname}</Label>
              <Input
                value={customerInfo.surname}
                onChange={(e) => setCustomerInfo((c) => ({ ...c, surname: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{translations.email}</Label>
            <Input
              type="email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo((c) => ({ ...c, email: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>{translations.phone}</Label>
            <Input
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo((c) => ({ ...c, phone: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>{translations.billingAddress}</Label>
            <Input
              value={customerInfo.billing_address}
              onChange={(e) =>
                setCustomerInfo((c) => ({ ...c, billing_address: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{translations.city}</Label>
              <Input
                value={customerInfo.city}
                onChange={(e) => setCustomerInfo((c) => ({ ...c, city: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>{translations.zipcode}</Label>
              <Input
                value={customerInfo.zipcode}
                onChange={(e) => setCustomerInfo((c) => ({ ...c, zipcode: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {translations.cancel}
          </Button>
          <Button type="button" onClick={handleSubmit} loading={loading} disabled={!isFormValid()}>
            {translations.proceedToPayment || translations.payNow}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
