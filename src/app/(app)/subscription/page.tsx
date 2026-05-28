"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  Check,
  CreditCard,
  Gift,
  Minus,
  Package,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";

import { SubscriptionPaymentDialog } from "@/components/subscription/SubscriptionPaymentDialog";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import SubscriptionRepositoryImpl from "@/data/repositories/SubscriptionRepositoryImpl";
import { useAppDispatch, useAppSelector } from "@/presentation/state/hooks";
import { checkSubscriptionStatus } from "@/presentation/state/userSlice";
import { getResponseData } from "@/utils/apiResponse";
import {
  calculateBundleSavings,
  calculateSubtotal,
  formatMoney,
  formatYearlyPrice,
  getBundleTranslation,
  getModuleTranslation,
  isProRatedModulePrice,
  normalizeBundle,
  normalizeModule,
  type AvailableModule,
  type ExpiryInfo,
  type RecommendedBundle,
  type TrialStatus,
} from "@/utils/subscription";
import { cn } from "@/lib/cn";

export default function SubscriptionPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { translations, accessToken, subscriberId, language, currency } =
    useAppSelector((s) => s.user);
  const lang = language === "en" ? "en-US" : "tr-TR";

  const [modules, setModules] = useState<AvailableModule[]>([]);
  const [bundle, setBundle] = useState<RecommendedBundle | null>(null);
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);
  const [expiryInfo, setExpiryInfo] = useState<ExpiryInfo | null>(null);
  const [selectedModuleIds, setSelectedModuleIds] = useState<number[]>([]);
  const [moduleQuantities, setModuleQuantities] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!accessToken || !subscriberId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const repo = new SubscriptionRepositoryImpl(translations, accessToken);
      const [modulesRes, bundleRes, trialRes, expiryRes] = await Promise.all([
        repo.getAvailableModules(subscriberId),
        repo.getRecommendedBundle(subscriberId),
        repo.getTrialStatus(subscriberId),
        repo.getExpiryInfo(subscriberId),
      ]);

      const list = getResponseData<Record<string, unknown>[]>(modulesRes) || [];
      const sorted = list
        .map(normalizeModule)
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

      setModules(sorted);
      setBundle(getResponseData<Record<string, unknown>>(bundleRes)
        ? normalizeBundle(getResponseData<Record<string, unknown>>(bundleRes)!)
        : null);
      setTrialStatus(getResponseData<TrialStatus>(trialRes));
      setExpiryInfo(getResponseData<ExpiryInfo>(expiryRes));
      setSelectedModuleIds([]);
      setModuleQuantities({});
    } catch (e) {
      toast.error((e as Error).message || translations.fetchError);
      setModules([]);
      setBundle(null);
      setTrialStatus(null);
      setExpiryInfo(null);
    } finally {
      setLoading(false);
    }
  }, [accessToken, subscriberId, translations]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const ownedCount = useMemo(
    () => modules.filter((m) => m.is_owned).length,
    [modules]
  );

  const allModulesOwned = modules.length > 0 && ownedCount === modules.length;
  const showCartBar = !allModulesOwned || selectedModuleIds.length > 0;
  const showAllOwnedMessage = allModulesOwned && selectedModuleIds.length === 0;

  const hasExistingSubscription =
    Boolean(trialStatus?.has_module_subscription) || ownedCount > 0;

  const isTrialActive = Boolean(trialStatus?.is_trial_active);

  const subscriptionEndDateLabel = useMemo(() => {
    const endDate = expiryInfo?.end_date;
    if (!endDate) return null;
    return new Date(endDate).toLocaleDateString(lang, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [expiryInfo?.end_date, lang]);

  const subscriptionDaysRemaining = Number(expiryInfo?.days_remaining || 0);

  const showProRatedPricingContext =
    hasExistingSubscription && !isTrialActive && Boolean(subscriptionEndDateLabel);

  const getProRatedPeriodLabel = useCallback(() => {
    if (subscriptionDaysRemaining > 0) {
      return (translations.proRatedForDays).replace(
        "{days}",
        String(subscriptionDaysRemaining)
      );
    }
    if (subscriptionEndDateLabel) {
      return (translations.proRatedUntilDate).replace(
        "{date}",
        subscriptionEndDateLabel
      );
    }
    return translations.proRatedForRemainingPeriod;
  }, [
    subscriptionDaysRemaining,
    subscriptionEndDateLabel,
    translations.proRatedForDays,
    translations.proRatedUntilDate,
    translations.proRatedForRemainingPeriod,
  ]);

  const isBusinessModuleSelected = useMemo(() => {
    const businessModule = modules.find((m) => m.code === "CREATE_BUSINESS");
    if (!businessModule) return false;
    return selectedModuleIds.includes(businessModule.module_id) || businessModule.is_owned;
  }, [modules, selectedModuleIds]);

  const toggleModule = (module: AvailableModule) => {
    if (module.is_owned && module.code !== "CREATE_BUSINESS") return;

    if (module.code !== "CREATE_BUSINESS" && !isBusinessModuleSelected) {
      toast.info(
        translations.selectBusinessModuleFirst
      );
      return;
    }

    setSelectedModuleIds((prev) => {
      if (prev.includes(module.module_id)) {
        if (module.code === "CREATE_BUSINESS") {
          setModuleQuantities((q) => {
            const copy = { ...q };
            delete copy[module.module_id];
            return copy;
          });
          const businessModule = modules.find((m) => m.code === "CREATE_BUSINESS");
          if (businessModule && !businessModule.is_owned) {
            return [];
          }
        }
        return prev.filter((id) => id !== module.module_id);
      }

      if (module.code === "CREATE_BUSINESS") {
        const defaultQty = Math.max(module.quantity || 1, 1);
        setModuleQuantities((q) => ({ ...q, [module.module_id]: defaultQty }));
      }
      return [...prev, module.module_id];
    });
  };

  const setBusinessQuantity = (moduleId: number, delta: number) => {
    setModuleQuantities((prev) => {
      const current = prev[moduleId] || 1;
      const next = Math.max(1, Math.min(50, current + delta));
      return { ...prev, [moduleId]: next };
    });
  };

  const applyBundle = () => {
    if (!bundle?.module_ids?.length) return;
    const unownedBundleIds = bundle.module_ids.filter((id) => {
      const module = modules.find((m) => m.module_id === id);
      return module && !module.is_owned;
    });

    if (unownedBundleIds.length === 0) {
      toast.info(translations.bundleAlreadyOwnedMessage);
      return;
    }

    setSelectedModuleIds((prev) => Array.from(new Set([...prev, ...unownedBundleIds])));
  };

  const selectedModules = useMemo(
    () => modules.filter((m) => selectedModuleIds.includes(m.module_id)),
    [modules, selectedModuleIds]
  );

  const subtotal = useMemo(
    () => calculateSubtotal(selectedModules, moduleQuantities, modules),
    [selectedModules, moduleQuantities, modules]
  );

  const isBundleDiscountActive = useMemo(() => {
    if (!bundle?.module_ids?.length) return false;
    return bundle.module_ids.every((id) => selectedModuleIds.includes(id));
  }, [bundle, selectedModuleIds]);

  const bundleSavings = useMemo(
    () => calculateBundleSavings(bundle, isBundleDiscountActive),
    [bundle, isBundleDiscountActive]
  );

  const cartTotal = Math.max(0, subtotal - bundleSavings);

  const cartHasProRatedItems = useMemo(() => {
    if (!showProRatedPricingContext) return false;
    const hasBusinessOwned = modules.some(
      (m) => m.code === "CREATE_BUSINESS" && m.is_owned
    );
    return selectedModules.some((module) => {
      if (module.code === "CREATE_BUSINESS") {
        const qty = moduleQuantities[module.module_id] || 1;
        const billable = hasBusinessOwned ? qty : Math.max(0, qty - 1);
        if (billable <= 0) return false;
        const yearly = Number(module.yearly_price || 0);
        const current = Number(module.current_price || 0);
        return yearly > 0 && current > 0 && current < yearly;
      }
      return isProRatedModulePrice(module, hasExistingSubscription, isTrialActive);
    });
  }, [
    showProRatedPricingContext,
    selectedModules,
    moduleQuantities,
    modules,
    hasExistingSubscription,
    isTrialActive,
  ]);

  const formatCartAmount = (value: number) =>
    cartHasProRatedItems
      ? formatMoney(value, currency)
      : formatYearlyPrice(value, translations.perYear);

  const handleProceedToPayment = () => {
    if (selectedModules.length === 0) {
      toast.info(translations.selectModulesMessage);
      return;
    }
    setPaymentOpen(true);
  };

  const handlePaymentSuccess = async () => {
    toast.success(translations.modulesPurchased);
    setSelectedModuleIds([]);
    setModuleQuantities({});
    await dispatch(checkSubscriptionStatus());
    fetchData();
  };

  const renderModulePrice = (module: AvailableModule, isSelected: boolean) => {
    const isCreateBusiness = module.code === "CREATE_BUSINESS";
    const yearlyPrice = Number(module.yearly_price || 0);
    const currentPrice = Number(module.current_price || 0);
    const isProRated =
      !isCreateBusiness &&
      isProRatedModulePrice(module, hasExistingSubscription, isTrialActive);
    const hasBusinessModuleOwned = modules.some(
      (m) => m.code === "CREATE_BUSINESS" && m.is_owned
    );
    const quantity = isCreateBusiness
      ? moduleQuantities[module.module_id] || module.quantity || 1
      : 1;
    const isFree = isCreateBusiness && quantity === 1 && !hasBusinessModuleOwned;
    const businessUnitProRated =
      isCreateBusiness &&
      !isFree &&
      yearlyPrice > 0 &&
      currentPrice > 0 &&
      currentPrice < yearlyPrice &&
      showProRatedPricingContext;

    if (isCreateBusiness && isSelected) {
      if (isFree) {
        return (
          <p className="text-base font-bold text-primary">{translations.free}</p>
        );
      }
      const billable = hasBusinessModuleOwned ? quantity : quantity - 1;
      return (
        <div className="space-y-1">
          <p className="text-base font-bold">
            {businessUnitProRated
              ? formatMoney(billable * currentPrice, currency)
              : formatYearlyPrice(billable * currentPrice, translations.perYear)}
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              ({billable} x{" "}
              {businessUnitProRated
                ? formatMoney(currentPrice, currency)
                : formatYearlyPrice(currentPrice, translations.perYear)}
              )
            </span>
          </p>
          {businessUnitProRated && (
            <p className="text-xs text-muted-foreground">{getProRatedPeriodLabel()}</p>
          )}
        </div>
      );
    }

    if (isCreateBusiness && !isSelected && !hasBusinessModuleOwned) {
      return (
        <p className="text-base font-bold text-primary">
          {translations.firstBusinessFree}
        </p>
      );
    }

    if (!isCreateBusiness && !module.is_owned) {
      if (isProRated && yearlyPrice > 0) {
        return (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              <span className="line-through">
                {formatYearlyPrice(yearlyPrice, translations.perYear)}
              </span>
              {" · "}
              {translations.yearlyReference}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-base font-bold">{formatMoney(currentPrice, currency)}</p>
              <Badge variant="outline" className="border-orange-500/40 text-orange-500">
                {translations.proRated}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{getProRatedPeriodLabel()}</p>
          </div>
        );
      }
      return (
        <p className="text-base font-bold text-primary">
          {formatYearlyPrice(currentPrice, translations.perYear)}
        </p>
      );
    }

    if (module.is_owned && !isCreateBusiness) {
      return (
        <p className="text-sm text-muted-foreground">
          {formatYearlyPrice(yearlyPrice, translations.perYear)}
        </p>
      );
    }

    return null;
  };

  return (
    <PageLayout
      back={{ label: translations.back, onClick: () => router.back() }}
      contentClassName="space-y-6 pb-28"
    >
      <h1 className="text-2xl font-bold">{translations.subscription}</h1>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {trialStatus?.is_trial_active && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/15">
                  <Gift className="size-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">
                    {translations.freeTrialActive}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {trialStatus.days_remaining}{" "}
                    {trialStatus.days_remaining === 1
                      ? translations.dayRemaining
                      : translations.daysRemaining}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {hasExistingSubscription && !isTrialActive && ownedCount > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">
                    {translations.currentSubscription}
                  </CardTitle>
                  {subscriptionDaysRemaining > 0 && subscriptionDaysRemaining <= 21 && (
                    <Badge variant="outline" className="border-orange-500/40 text-orange-500">
                      {subscriptionDaysRemaining}{" "}
                      {subscriptionDaysRemaining === 1
                        ? translations.dayRemaining
                        : translations.daysRemaining}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {subscriptionEndDateLabel && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarClock className="size-4 shrink-0" />
                    <span>
                      {translations.subscriptionEndDate}: {subscriptionEndDateLabel}
                    </span>
                  </div>
                )}
                <div className="border-t border-border pt-3">
                  {modules
                    .filter((m) => m.is_owned)
                    .map((module) => (
                      <div
                        key={module.module_id}
                        className="flex items-center gap-3 py-2 text-sm"
                      >
                        <Check className="size-4 shrink-0 text-primary" />
                        <span className="flex-1 truncate">
                          {getModuleTranslation(
                            module.code,
                            "name",
                            module.name,
                            translations
                          )}
                        </span>
                        {module.code === "CREATE_BUSINESS" && (module.quantity || 0) > 0 && (
                          <span className="text-muted-foreground">x{module.quantity}</span>
                        )}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {bundle && (
            <Card className="overflow-hidden border-2 border-primary">
              <div className="bg-primary py-1.5 text-center text-xs font-bold uppercase tracking-wider text-primary-foreground">
                {translations.recommended}
              </div>
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex size-11 items-center justify-center rounded-full bg-primary/15">
                    <Package className="size-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">
                      {getBundleTranslation(bundle.name, "name", bundle.name, translations) ||
                        translations.basicBundle}
                    </h3>
                    {bundle.discount_percentage > 0 && (
                      <p className="text-xs font-semibold text-primary">
                        {translations.save} %{bundle.discount_percentage.toFixed(0)}
                      </p>
                    )}
                  </div>
                </div>
                {bundle.description && (
                  <p className="text-sm text-muted-foreground">
                    {getBundleTranslation(
                      bundle.name,
                      "description",
                      bundle.description,
                      translations
                    )}
                  </p>
                )}
                <div className="flex items-end gap-2">
                  {bundle.total_price > bundle.bundle_price && (
                    <p className="text-base text-muted-foreground line-through">
                      {formatYearlyPrice(bundle.total_price, translations.perYear)}
                    </p>
                  )}
                  <p className="text-2xl font-bold">
                    {formatYearlyPrice(bundle.bundle_price, translations.perYear)}
                  </p>
                </div>
                <Button
                  className="w-full"
                  variant={
                    bundle.module_ids.every((id) =>
                      modules.find((m) => m.module_id === id)?.is_owned
                    )
                      ? "outline"
                      : "default"
                  }
                  disabled={bundle.module_ids.every((id) =>
                    modules.find((m) => m.module_id === id)?.is_owned
                  )}
                  onClick={applyBundle}
                >
                  {bundle.module_ids.every((id) => modules.find((m) => m.module_id === id)?.is_owned)
                    ? translations.alreadyOwned
                    : translations.applyBundle}
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              {translations.availableModules}
            </h2>
            {showProRatedPricingContext ? (
              <p className="text-xs leading-relaxed text-muted-foreground">
                {(translations.proRatedBillingNote)
                  .replace("{date}", subscriptionEndDateLabel || "")}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {translations.annualModulePrices}
              </p>
            )}
          </div>

          {modules.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <p className="text-muted-foreground">
                {translations.noModulesAvailable}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {modules.map((module) => {
                const isSelected = selectedModuleIds.includes(module.module_id);
                const isOwned = module.is_owned;
                const isCreateBusiness = module.code === "CREATE_BUSINESS";
                const isDisabled =
                  (!isCreateBusiness && !isBusinessModuleSelected && !isOwned) ||
                  (isOwned && !isCreateBusiness);
                const quantity = isCreateBusiness
                  ? moduleQuantities[module.module_id] || module.quantity || 1
                  : 1;

                return (
                  <Card
                    key={module.module_id}
                    className={cn(
                      "cursor-pointer transition-colors",
                      isSelected && "border-primary ring-1 ring-primary/30",
                      isDisabled && !isOwned && "opacity-60",
                      isOwned && !isCreateBusiness && "opacity-70"
                    )}
                    onClick={() => !isDisabled && toggleModule(module)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base leading-snug">
                          {getModuleTranslation(
                            module.code,
                            "name",
                            module.name,
                            translations
                          )}
                        </CardTitle>
                        {isOwned && !isCreateBusiness ? (
                          <Badge variant="success" className="shrink-0">
                            <Check className="size-3" />
                            {translations.owned}
                          </Badge>
                        ) : (
                          <div
                            className={cn(
                              "flex size-6 shrink-0 items-center justify-center rounded-md border-2",
                              isSelected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted-foreground/40"
                            )}
                          >
                            {isSelected && <Check className="size-3.5" />}
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {module.description && (
                        <p className="text-sm text-muted-foreground">
                          {getModuleTranslation(
                            module.code,
                            "description",
                            module.description,
                            translations
                          )}
                        </p>
                      )}

                      {isCreateBusiness && isSelected && (
                        <div
                          className="flex items-center gap-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-xs text-muted-foreground">
                            {translations.businessCount}:
                          </span>
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className="size-8"
                            onClick={() => setBusinessQuantity(module.module_id, -1)}
                          >
                            <Minus className="size-4" />
                          </Button>
                          <span className="min-w-6 text-center font-bold">{quantity}</span>
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className="size-8"
                            onClick={() => setBusinessQuantity(module.module_id, 1)}
                          >
                            <Plus className="size-4" />
                          </Button>
                        </div>
                      )}

                      {renderModulePrice(module, isSelected)}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {!loading && showCartBar && (
        <div className="sticky bottom-4 z-10">
          <Card className="border-primary shadow-lg">
            <CardContent className="space-y-3 p-4">
              {selectedModules.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {translations.selectModulesMessage}
                </p>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">
                      {selectedModules.length}{" "}
                      {selectedModules.length === 1
                        ? translations.moduleSelected
                        : translations.modulesSelected}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedModuleIds([]);
                        setModuleQuantities({});
                      }}
                    >
                      {translations.clear}
                    </Button>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>{translations.subtotal}</span>
                      <span>{formatCartAmount(subtotal)}</span>
                    </div>
                    {isBundleDiscountActive && bundleSavings > 0 && (
                      <div className="flex justify-between font-semibold text-primary">
                        <span>{translations.bundleDiscount}</span>
                        <span>-{formatCartAmount(bundleSavings)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold">{translations.total}</span>
                    <span className="text-xl font-bold">{formatCartAmount(cartTotal)}</span>
                  </div>
                  {cartHasProRatedItems && (
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {translations.proRatedCartNote}
                    </p>
                  )}
                </>
              )}
              <Button
                className="w-full"
                disabled={selectedModules.length === 0}
                onClick={handleProceedToPayment}
              >
                <CreditCard className="size-4" />
                {translations.proceedToPayment || translations.payNow}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {!loading && showAllOwnedMessage && (
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Check className="size-5 text-primary" />
            <p className="font-semibold">
              {translations.allModulesOwned}
            </p>
          </CardContent>
        </Card>
      )}

      {accessToken && subscriberId && (
        <SubscriptionPaymentDialog
          open={paymentOpen}
          onOpenChange={setPaymentOpen}
          subscriberId={subscriberId}
          accessToken={accessToken}
          translations={translations}
          selectedModules={selectedModules}
          moduleQuantities={moduleQuantities}
          totalAmount={cartTotal}
          currency={currency}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </PageLayout>
  );
}
