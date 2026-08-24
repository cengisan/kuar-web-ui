"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, RefreshCw, Gift } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { BusinessCard } from "@/components/business/BusinessCard";
import BusinessRepositoryImpl from "@/data/repositories/BusinessRepositoryImpl";
import SubscriptionRepositoryImpl from "@/data/repositories/SubscriptionRepositoryImpl";
import FeedbackRepositoryImpl from "@/data/repositories/FeedbackRepositoryImpl";
import { useAppDispatch, useAppSelector } from "@/presentation/state/hooks";
import { setUnreadFeedbackCount } from "@/presentation/state/userSlice";
import { getResponseData } from "@/utils/apiResponse";
import type { TrialStatus } from "@/utils/subscription";
import type { Business } from "@/types";

interface ExpiryInfo {
  show_banner?: boolean;
  days_remaining?: number;
  status?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { translations, accessToken, subscriberId, isEmployee, employeeData } =
    useAppSelector((s) => s.user);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expiryInfo, setExpiryInfo] = useState<ExpiryInfo | null>(null);
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);

  const businessId = (b: Business) => b.business_id ?? b.id ?? 0;

  const fetchBusinesses = useCallback(async () => {
    if (!subscriberId || !accessToken) return;
    try {
      const repo = new BusinessRepositoryImpl(translations, accessToken);
      const response = await repo.getAllBusinesses(subscriberId);
      const data = getResponseData<Business[]>(response);
      setBusinesses(Array.isArray(data) ? data : []);
    } catch {
      setBusinesses([]);
    }
  }, [subscriberId, accessToken, translations]);

  const fetchExpiry = useCallback(async () => {
    if (!subscriberId || !accessToken) return;
    try {
      const repo = new SubscriptionRepositoryImpl(translations, accessToken);
      const response = await repo.getExpiryInfo(subscriberId);
      const data = getResponseData<ExpiryInfo>(response);
      if (data) setExpiryInfo(data);
    } catch {
      /* ignore */
    }
  }, [subscriberId, accessToken, translations]);

  const fetchTrialStatus = useCallback(async () => {
    if (!subscriberId || !accessToken) return;
    try {
      const repo = new SubscriptionRepositoryImpl(translations, accessToken);
      const response = await repo.getTrialStatus(subscriberId);
      setTrialStatus(getResponseData<TrialStatus>(response));
    } catch {
      setTrialStatus(null);
    }
  }, [subscriberId, accessToken, translations]);

  const fetchUnreadFeedback = useCallback(async () => {
    if (!subscriberId || !accessToken) return;
    try {
      const repo = new FeedbackRepositoryImpl(translations, accessToken);
      const result = await repo.getAllFeedbacks(subscriberId);
      if (result.success) {
        const unread = result.feedbacks.filter((f) => !f.read).length;
        dispatch(setUnreadFeedbackCount(unread));
      }
    } catch {
      /* ignore */
    }
  }, [subscriberId, accessToken, translations, dispatch]);

  useEffect(() => {
    if (isEmployee && employeeData?.businessId) {
      router.replace(`/business/${employeeData.businessId}`);
      return;
    }
    (async () => {
      setLoading(true);
      await Promise.all([
        fetchBusinesses(),
        fetchExpiry(),
        fetchTrialStatus(),
        fetchUnreadFeedback(),
      ]);
      setLoading(false);
    })();
  }, [isEmployee, employeeData, router, fetchBusinesses, fetchExpiry, fetchTrialStatus, fetchUnreadFeedback]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchBusinesses(), fetchExpiry(), fetchTrialStatus()]);
    setRefreshing(false);
  };

  const handleCreate = async () => {
    if (!subscriberId) return;
    try {
      const repo = new SubscriptionRepositoryImpl(translations, accessToken);
      const limitRes = await repo.getBusinessLimit(subscriberId);
      const limit = Number(limitRes?.data || 0);
      if (limit > 0 && businesses.length >= limit) {
        toast.warning(translations.businessLimitTitle, {
          description: translations.businessLimitMessage,
        });
        return;
      }
    } catch {
      /* backend will enforce */
    }
    router.push("/business/create");
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{translations.home}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {translations.manageBusinesses}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={onRefresh} disabled={refreshing}>
            <RefreshCw className={refreshing ? "animate-spin" : ""} />
            <span className="sr-only">{translations.refresh}</span>
          </Button>
          <Button onClick={handleCreate}>
            <Plus />
            {translations.createBusiness}
          </Button>
        </div>
      </div>

      {trialStatus?.is_trial_active && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/15">
              <Gift className="size-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">{translations.freeTrialActive}</p>
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

      {expiryInfo?.show_banner && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
          <p className="font-semibold">
            {translations.subscriptionExpiresIn}{" "}
            {String(expiryInfo.days_remaining)} {translations.days}
          </p>
          <p className="mt-1 text-amber-200/80">
            {translations.renewToKeepAccess}
          </p>
        </div>
      )}

      {businesses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/50 p-12 text-center backdrop-blur-sm">
          <p className="text-xl font-semibold">
            {translations.welcomeToKuar}
          </p>
          <p className="mt-2 text-muted-foreground">
            {translations.noBusinesses}
          </p>
          <Button className="mt-6" onClick={handleCreate}>
            <Plus />
            {translations.createFirstBusiness}
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {businesses.map((b) => (
            <BusinessCard key={businessId(b)} business={b} />
          ))}
        </div>
      )}
    </div>
  );
}
