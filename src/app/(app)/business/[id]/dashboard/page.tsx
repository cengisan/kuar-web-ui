"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { BarChart3, ShoppingBag, TrendingUp, Wallet } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import ReportRepositoryImpl from "@/data/repositories/ReportRepositoryImpl";
import { useAppSelector } from "@/presentation/state/hooks";
import type { DashboardData } from "@/utils/dashboard";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

function formatChartLabel(date: string, period: string) {
  if (period === "month" && date.includes(".")) {
    const day = date.split(".")[0];
    return String(parseInt(day, 10) || date);
  }
  return date;
}

export default function BusinessDashboardPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const businessId = Number(params.id);
  const { translations, accessToken, currency } = useAppSelector((s) => s.user);

  const [period, setPeriod] = useState("today");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

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

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const repo = new ReportRepositoryImpl(translations, accessToken);
      const result = await repo.getDashboardData(businessId, period);
      if (result.success && result.data) {
        setData(result.data);
      } else {
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, businessId, period, translations]);

  useEffect(() => {
    load();
  }, [load]);

  const chartData = useMemo(
    () =>
      (data?.revenueChart ?? []).map((point) => ({
        ...point,
        label: formatChartLabel(point.date, period),
      })),
    [data?.revenueChart, period]
  );

  const pieData = useMemo(
    () =>
      (data?.paymentDistribution ?? []).map((slice) => ({
        ...slice,
        method:
          methodLabels[slice.method as keyof typeof methodLabels] ||
          slice.methodLabel ||
          slice.method,
      })),
    [data?.paymentDistribution, methodLabels]
  );

  const stats = useMemo(
    () => [
      {
        label: translations.revenue,
        value: `${(data?.totalRevenue || 0).toFixed(2)} ${currency}`,
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
        label: translations.totalItems,
        value: String(data?.totalItems || 0),
        icon: BarChart3,
        color: "#f59e0b",
      },
      {
        label: translations.averageOrder,
        value: `${(data?.averageOrderAmount || 0).toFixed(2)} ${currency}`,
        icon: TrendingUp,
        color: "#8b5cf6",
      },
    ],
    [data, currency, translations]
  );

  const chartTitle =
    period === "today"
      ? translations.today
      : period === "week"
        ? translations.last7Days
        : translations.thisMonth;

  return (
    <PageLayout
      back={{ label: translations.back, onClick: () => router.back() }}
      contentClassName="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{translations.dashboard}</h1>
      </div>

      <Tabs value={period} onValueChange={setPeriod}>
        <TabsList>
          <TabsTrigger value="today">{translations.today}</TabsTrigger>
          <TabsTrigger value="week">{translations.thisWeek}</TabsTrigger>
          <TabsTrigger value="month">{translations.thisMonth}</TabsTrigger>
        </TabsList>

        <TabsContent value={period}>
          {loading ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((s) => (
                  <Card key={s.label}>
                    <CardContent className="flex items-center gap-4 p-4">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${s.color}22` }}
                      >
                        <s.icon className="h-6 w-6" style={{ color: s.color }} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                        <p className="text-lg font-bold">{s.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{chartTitle}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {chartData.length === 0 ? (
                      <p className="text-center text-sm text-muted-foreground">
                        {translations.noReportData}
                      </p>
                    ) : (
                      <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={chartData}>
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
                              `${Number(value).toFixed(2)} ${currency}`,
                              translations.revenue,
                            ]}
                          />
                          <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      {translations.paymentDistribution}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pieData.length === 0 ? (
                      <p className="text-center text-sm text-muted-foreground">
                        {translations.noReportData}
                      </p>
                    ) : (
                      <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            dataKey="amount"
                            nameKey="method"
                            outerRadius={80}
                            label
                          >
                            {pieData.map((_, i) => (
                              <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--card)",
                              border: "1px solid var(--border)",
                              borderRadius: 8,
                            }}
                            formatter={(value) => [
                              `${Number(value).toFixed(2)} ${currency}`,
                            ]}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{translations.topProducts}</CardTitle>
                </CardHeader>
                <CardContent>
                  {(data?.topProducts || []).length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground">
                      {translations.noReportData}
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {(data?.topProducts || []).slice(0, 10).map((p, i) => (
                        <li
                          key={`${p.productName}-${i}`}
                          className="flex items-center gap-3 rounded-lg bg-muted/40 p-3"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                            {i + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">{p.productName}</p>
                            <p className="text-xs text-muted-foreground">
                              {p.quantity} {translations.soldItems}
                              {p.percentage != null ? ` · ${p.percentage}%` : ""}
                            </p>
                          </div>
                          <p className="font-semibold tabular-nums">
                            {p.revenue.toFixed(2)} {currency}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
