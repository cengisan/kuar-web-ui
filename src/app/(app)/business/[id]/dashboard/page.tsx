"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import {
  Banknote,
  BarChart3,
  CreditCard,
  FileText,
  Layers,
  ShoppingBag,
  Smartphone,
  TrendingUp,
  Utensils,
  Wallet,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import BusinessRepositoryImpl from "@/data/repositories/BusinessRepositoryImpl";
import ReportRepositoryImpl from "@/data/repositories/ReportRepositoryImpl";
import { useAppSelector } from "@/presentation/state/hooks";
import { cn } from "@/lib/cn";
import type {
  DashboardData,
  DashboardPaymentSlice,
  DashboardTopProduct,
} from "@/utils/dashboard";

const PERIODS = ["today", "week", "month"] as const;
type DashboardPeriod = (typeof PERIODS)[number];
type ExportPeriod = "3months" | "6months";

const METHOD_COLORS: Record<string, string> = {
  CASH: "#10b981",
  CREDIT_CARD: "#3b82f6",
  MEAL_CARD: "#f59e0b",
  MOBILE_PAYMENT: "#9c27b0",
  MIXED: "#eab308",
};

function formatChartLabel(date: string, period: DashboardPeriod) {
  if (period === "month" && date.includes(".")) {
    const day = date.split(".")[0];
    return String(parseInt(day, 10) || date);
  }
  return date;
}

function formatCurrency(amount: number, currency: string) {
  if (amount >= 1000) {
    return (
      amount.toLocaleString("tr-TR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }) + ` ${currency}`
    );
  }
  return `${amount.toFixed(2)} ${currency}`;
}

function PaymentMethodIcon({
  method,
  color,
}: {
  method: string;
  color?: string;
}) {
  const props = {
    className: "size-4 shrink-0",
    style: color ? { color } : undefined,
  };
  switch (method) {
    case "CASH":
      return <Banknote {...props} />;
    case "CREDIT_CARD":
      return <CreditCard {...props} />;
    case "MEAL_CARD":
      return <Utensils {...props} />;
    case "MOBILE_PAYMENT":
      return <Smartphone {...props} />;
    case "MIXED":
      return <Layers {...props} />;
    default:
      return <CreditCard {...props} />;
  }
}

function rankStyle(index: number) {
  if (index === 0) return "bg-amber-500/20 text-amber-400";
  if (index === 1) return "bg-slate-400/20 text-slate-300";
  if (index === 2) return "bg-orange-700/20 text-orange-400";
  return "bg-muted text-muted-foreground";
}

export default function BusinessDashboardPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const businessId = Number(params.id);
  const { translations, accessToken, currency } = useAppSelector((s) => s.user);

  const [period, setPeriod] = useState<DashboardPeriod>("today");
  const [data, setData] = useState<DashboardData | null>(null);
  const [productData, setProductData] = useState<DashboardTopProduct[]>([]);
  const [paymentData, setPaymentData] = useState<DashboardPaymentSlice[]>([]);
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState<ExportPeriod | null>(null);

  const periodLabels: Record<DashboardPeriod, string> = useMemo(
    () => ({
      today: translations.today,
      week: translations.thisWeek,
      month: translations.thisMonth,
    }),
    [translations]
  );

  const methodLabels = useMemo(
    () => ({
      CASH: translations.cash,
      CREDIT_CARD: translations.creditCard,
      MEAL_CARD: translations.mealCard,
      MOBILE_PAYMENT: translations.mobilePayment,
      MIXED: translations.mixed,
    }),
    [translations]
  );

  const loadBusinessName = useCallback(async () => {
    if (!accessToken) return;
    try {
      const repo = new BusinessRepositoryImpl(translations, accessToken);
      const response = await repo.getBusinessById(businessId);
      if (
        response &&
        "meta" in response &&
        response.meta?.business_code === 0 &&
        response.data
      ) {
        const business = response.data as { name?: string };
        if (business.name) setBusinessName(business.name);
      }
    } catch {
      /* optional */
    }
  }, [accessToken, businessId, translations]);

  const loadPeriodDetails = useCallback(
    async (selectedPeriod: DashboardPeriod) => {
      if (!accessToken) return;
      const repo = new ReportRepositoryImpl(translations, accessToken);
      const [productsResult, paymentsResult] = await Promise.all([
        repo.getProductAnalysis(businessId, selectedPeriod),
        repo.getPaymentMethodBreakdown(businessId, selectedPeriod),
      ]);
      if (productsResult.success) {
        setProductData(productsResult.data || []);
      } else {
        setProductData([]);
      }
      if (paymentsResult.success) {
        setPaymentData(paymentsResult.data || []);
      } else {
        setPaymentData([]);
      }
    },
    [accessToken, businessId, translations]
  );

  const loadDashboard = useCallback(
    async (selectedPeriod: DashboardPeriod) => {
      if (!accessToken) return;
      setLoading(true);
      try {
        const repo = new ReportRepositoryImpl(translations, accessToken);
        const result = await repo.getDashboardData(businessId, selectedPeriod);
        if (result.success && result.data) {
          setData(result.data);
        } else {
          setData(null);
          if (result.message) toast.error(result.message);
        }
        await loadPeriodDetails(selectedPeriod);
      } finally {
        setLoading(false);
      }
    },
    [accessToken, businessId, loadPeriodDetails, translations]
  );

  useEffect(() => {
    loadBusinessName();
  }, [loadBusinessName]);

  useEffect(() => {
    loadDashboard(period);
  }, [loadDashboard, period]);

  const handlePeriodChange = (next: DashboardPeriod) => {
    setPeriod(next);
  };

  const handleExportReport = async (exportPeriod: ExportPeriod) => {
    if (!accessToken) return;
    setExportLoading(exportPeriod);
    try {
      const repo = new ReportRepositoryImpl(translations, accessToken);
      const result = await repo.exportReport(businessId, exportPeriod);
      if (result.success && result.data) {
        const blob = new Blob([result.data], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `kuar-report-${exportPeriod}.html`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        toast.success(translations.reportReady);
      } else {
        toast.error(result.message || translations.fetchFailed);
      }
    } catch (e) {
      toast.error((e as Error).message || translations.fetchFailed);
    } finally {
      setExportLoading(null);
    }
  };

  const chartData = useMemo(
    () =>
      (data?.revenueChart ?? []).map((point) => ({
        ...point,
        label: formatChartLabel(point.date, period),
      })),
    [data?.revenueChart, period]
  );

  const chartTitle =
    period === "today"
      ? translations.today
      : period === "week"
        ? translations.last7Days
        : translations.thisMonth;

  const stats = useMemo(
    () => [
      {
        label: translations.revenue,
        value: formatCurrency(data?.totalRevenue || 0, currency),
        icon: Wallet,
        color: "#10b981",
      },
      {
        label: translations.totalOrders,
        value: String(data?.totalOrders || 0),
        icon: ShoppingBag,
        color: "#3b82f6",
      },
      {
        label: translations.averageOrder,
        value: formatCurrency(data?.averageOrderAmount || 0, currency),
        icon: TrendingUp,
        color: "#f59e0b",
      },
      {
        label: translations.totalItems,
        value: String(data?.totalItems || 0),
        icon: BarChart3,
        color: "#9c27b0",
      },
    ],
    [currency, data, translations]
  );

  if (loading && !data) {
    return (
      <PageLayout
        back={{ label: translations.back, onClick: () => router.back() }}
      >
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      back={{ label: translations.back, onClick: () => router.back() }}
      contentClassName="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold">{translations.dashboard}</h1>
        {businessName ? (
          <p className="mt-1 text-sm text-muted-foreground">{businessName}</p>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/80 shadow-card">
            <CardContent className="flex items-center gap-4 p-4">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: `${s.color}22` }}
              >
                <s.icon className="size-5" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {chartData.length > 0 && (
        <Card className="border-border/80 shadow-card">
          <CardHeader>
            <CardTitle>{chartTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="label"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                  formatter={(value) => [
                    formatCurrency(Number(value), currency),
                    translations.revenue,
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#10b981" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-2">
        {PERIODS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => handlePeriodChange(p)}
            className={cn(
              "rounded-xl border py-3 text-sm font-semibold transition-colors",
              period === p
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            {periodLabels[p]}
          </button>
        ))}
      </div>

      <Card className="border-border/80 shadow-card">
        <CardHeader>
          <CardTitle>{translations.topProducts}</CardTitle>
        </CardHeader>
        <CardContent>
          {productData.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {translations.noReportData}
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {productData.slice(0, 5).map((product, index) => (
                <li
                  key={`${product.productName}-${index}`}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                      rankStyle(index)
                    )}
                  >
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{product.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.quantity} {translations.soldItems}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary tabular-nums">
                      {formatCurrency(product.revenue, currency)}
                    </p>
                    {product.percentage != null && (
                      <p className="text-xs text-muted-foreground">
                        {product.percentage}%
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-card">
        <CardHeader>
          <CardTitle>{translations.paymentDistribution}</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentData.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {translations.noReportData}
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {paymentData.map((payment, index) => {
                const barColor =
                  METHOD_COLORS[payment.method] || METHOD_COLORS.CASH;
                const label =
                  methodLabels[
                    payment.method as keyof typeof methodLabels
                  ] ||
                  payment.methodLabel ||
                  payment.method;

                return (
                  <li key={`${payment.method}-${index}`} className="py-3 first:pt-0 last:pb-0">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <PaymentMethodIcon
                          method={payment.method}
                          color={barColor}
                        />
                        <span className="text-sm font-medium">{label}</span>
                      </div>
                      <div className="text-right text-sm">
                        <span className="font-bold tabular-nums">
                          {formatCurrency(payment.amount, currency)}
                        </span>
                        {payment.percentage != null && (
                          <span className="ml-1 text-xs text-muted-foreground">
                            ({payment.percentage}%)
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-[width]"
                        style={{
                          width: `${Math.min(payment.percentage ?? 0, 100)}%`,
                          backgroundColor: barColor,
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-card">
        <CardHeader>
          <CardTitle>{translations.detailedReport}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20">
              <FileText className="size-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-semibold">
                {translations.downloadReport}
              </p>
              <p className="text-xs text-muted-foreground">
                {translations.reportDescription}
              </p>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              type="button"
              onClick={() => handleExportReport("3months")}
              loading={exportLoading === "3months"}
              disabled={exportLoading !== null && exportLoading !== "3months"}
            >
              {translations.last3Months}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleExportReport("6months")}
              loading={exportLoading === "6months"}
              disabled={exportLoading !== null && exportLoading !== "6months"}
            >
              {translations.last6Months}
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
