export interface DashboardTopProduct {
  productName: string;
  quantity: number;
  revenue: number;
  percentage?: number;
}

export interface DashboardPaymentSlice {
  method: string;
  methodLabel?: string;
  amount: number;
  count: number;
  percentage?: number;
}

export interface DashboardRevenuePoint {
  date: string;
  revenue: number;
  orders?: number;
}

export interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  totalItems: number;
  averageOrderAmount: number;
  topProducts: DashboardTopProduct[];
  paymentDistribution: DashboardPaymentSlice[];
  revenueChart: DashboardRevenuePoint[];
}

function asRecord(value: unknown): Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function formatChartDate(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length >= 3) {
    const [y, m, d] = value;
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }
  return String(value);
}

export function normalizeTopProduct(raw: unknown): DashboardTopProduct {
  const r = asRecord(raw);
  return {
    productName: String(r.productName ?? r.product_name ?? r.name ?? ""),
    quantity: Number(r.totalQuantity ?? r.quantity ?? 0),
    revenue: Number(r.totalRevenue ?? r.revenue ?? 0),
    percentage:
      r.percentage != null ? Number(r.percentage) : undefined,
  };
}

export function normalizePaymentSlice(raw: unknown): DashboardPaymentSlice {
  const r = asRecord(raw);
  return {
    method: String(r.method ?? r.payment_method ?? ""),
    methodLabel: r.methodLabel ? String(r.methodLabel) : undefined,
    amount: Number(r.amount ?? 0),
    count: Number(r.count ?? 0),
    percentage:
      r.percentage != null ? Number(r.percentage) : undefined,
  };
}

export function normalizeRevenuePoint(raw: unknown): DashboardRevenuePoint {
  const r = asRecord(raw);
  return {
    date: formatChartDate(r.date),
    revenue: Number(r.revenue ?? r.totalRevenue ?? r.total_revenue ?? 0),
    orders:
      r.orders != null
        ? Number(r.orders)
        : r.totalOrders != null
          ? Number(r.totalOrders)
          : undefined,
  };
}

export function normalizeDashboard(raw: unknown): DashboardData {
  const r = asRecord(raw);
  const topProductsRaw = r.topProducts ?? r.top_products;
  const paymentRaw =
    r.paymentMethodBreakdown ?? r.payment_distribution ?? r.paymentBreakdown;
  const chartRaw = r.revenueChart ?? r.daily_revenue ?? r.revenue_chart;

  return {
    totalRevenue: Number(r.totalRevenue ?? r.total_revenue ?? 0),
    totalOrders: Number(r.totalOrders ?? r.total_orders ?? 0),
    totalItems: Number(r.totalItems ?? r.total_items ?? 0),
    averageOrderAmount: Number(
      r.averageOrderAmount ?? r.average_order_amount ?? r.average_order ?? 0
    ),
    topProducts: Array.isArray(topProductsRaw)
      ? topProductsRaw.map(normalizeTopProduct)
      : [],
    paymentDistribution: Array.isArray(paymentRaw)
      ? paymentRaw.map(normalizePaymentSlice)
      : [],
    revenueChart: Array.isArray(chartRaw)
      ? chartRaw.map(normalizeRevenuePoint)
      : [],
  };
}

export function normalizeWeeklyRevenue(raw: unknown): DashboardRevenuePoint[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => normalizeRevenuePoint(item));
}
