import type { Order, OrderItem } from "@/types";

export function getOrderItemId(item: OrderItem) {
  const raw = item.id ?? (item as OrderItem & { itemId?: number }).itemId;
  if (raw == null || Number.isNaN(Number(raw))) return undefined;
  const id = Number(raw);
  return id > 0 ? id : undefined;
}

export function normalizeOrderItem(raw: Record<string, unknown>): OrderItem {
  const quantity = Number(raw.quantity ?? 1);
  const unitPrice = Number(raw.unitPrice ?? raw.price ?? 0);
  const totalPrice = Number(
    raw.totalPrice ?? raw.total_price ?? unitPrice * quantity
  );
  const deliveredQuantity = Number(
    raw.deliveredQuantity ?? raw.delivered_quantity ?? 0
  );
  const itemId = raw.id ?? raw.itemId;

  return {
    id: itemId != null ? Number(itemId) : 0,
    productId: raw.productId != null ? Number(raw.productId) : undefined,
    product_id: raw.productId != null ? Number(raw.productId) : raw.product_id != null ? Number(raw.product_id) : undefined,
    productName: String(raw.productName ?? raw.product_name ?? ""),
    product_name: String(raw.productName ?? raw.product_name ?? ""),
    quantity,
    unitPrice,
    price: unitPrice,
    totalPrice,
    status: raw.status ? String(raw.status) : undefined,
    note: raw.note ? String(raw.note) : undefined,
    deliveredQuantity,
    delivered_quantity: deliveredQuantity,
    paidQuantity:
      raw.paidQuantity != null
        ? Number(raw.paidQuantity)
        : raw.paid_quantity != null
          ? Number(raw.paid_quantity)
          : undefined,
    isPaid: Boolean(raw.isPaid ?? raw.is_paid),
  };
}

/** Kitchen list API uses orderId / itemId instead of id on nested items. */
export function normalizeKitchenOrder(raw: Record<string, unknown>): Order {
  const items = Array.isArray(raw.items)
    ? raw.items.map((item) =>
        normalizeOrderItem(item as Record<string, unknown>)
      )
    : [];

  const orderId = raw.orderId ?? raw.id;

  return {
    id: orderId != null ? Number(orderId) : 0,
    orderNumber: raw.orderNumber ? String(raw.orderNumber) : undefined,
    tableNumber: raw.tableNumber ? String(raw.tableNumber) : undefined,
    table_number: raw.tableNumber ? String(raw.tableNumber) : undefined,
    status: "ACTIVE",
    totalAmount: 0,
    total_amount: 0,
    items,
    created_date: raw.createdDate
      ? String(raw.createdDate)
      : raw.created_date
        ? String(raw.created_date)
        : undefined,
  };
}

export function normalizeOrder(raw: Record<string, unknown>): Order {
  const items = Array.isArray(raw.items)
    ? raw.items.map((item) =>
        normalizeOrderItem(item as Record<string, unknown>)
      )
    : [];

  const totalAmount = Number(raw.totalAmount ?? raw.total_amount ?? 0);
  const tableId =
    raw.tableId != null
      ? Number(raw.tableId)
      : raw.table_id != null
        ? Number(raw.table_id)
        : undefined;
  const tableNumber = String(raw.tableNumber ?? raw.table_number ?? "");

  return {
    id: Number(raw.id),
    orderNumber: raw.orderNumber ? String(raw.orderNumber) : undefined,
    tableId,
    table_id: tableId,
    tableNumber: tableNumber || undefined,
    table_number: tableNumber || undefined,
    business_id:
      raw.business_id != null
        ? Number(raw.business_id)
        : raw.businessId != null
          ? Number(raw.businessId)
          : undefined,
    status: String(raw.status ?? ""),
    totalAmount,
    total_amount: totalAmount,
    paidAmount:
      raw.paidAmount != null
        ? Number(raw.paidAmount)
        : raw.paid_amount != null
          ? Number(raw.paid_amount)
          : 0,
    paid_amount:
      raw.paidAmount != null
        ? Number(raw.paidAmount)
        : raw.paid_amount != null
          ? Number(raw.paid_amount)
          : 0,
    waiterName: raw.waiterName ? String(raw.waiterName) : undefined,
    customerNote: raw.customerNote ? String(raw.customerNote) : undefined,
    items,
    created_date: raw.createdDate ? String(raw.createdDate) : raw.created_date ? String(raw.created_date) : undefined,
  };
}

export function getItemProductName(item: OrderItem) {
  return item.productName || item.product_name || "";
}

export function getItemUnitPrice(item: OrderItem) {
  return item.unitPrice ?? item.price ?? 0;
}

export function getItemTotalPrice(item: OrderItem) {
  if (item.totalPrice != null) return item.totalPrice;
  return getItemUnitPrice(item) * (item.quantity ?? 1);
}

export function getItemDeliveredQuantity(item: OrderItem) {
  return item.deliveredQuantity ?? item.delivered_quantity ?? 0;
}

export function getItemRemaining(item: OrderItem) {
  return Math.max(0, (item.quantity ?? 1) - getItemDeliveredQuantity(item));
}

export function getOrderTotal(order: Order) {
  return order.totalAmount ?? order.total_amount ?? 0;
}

export function getOrderPaidAmount(order: Order) {
  return order.paidAmount ?? order.paid_amount ?? 0;
}

export function getOrderItemPaidQuantity(item: OrderItem) {
  return item.paidQuantity ?? item.paid_quantity ?? 0;
}

/** Sum line totals when order-level total is missing or zero. */
export function getOrderTotalFromItems(items: OrderItem[] = []) {
  return items
    .filter((item) => item.status !== "CANCELLED")
    .reduce((sum, item) => sum + getItemTotalPrice(item), 0);
}

export function getCashierTotals(
  order: Order | null,
  items: OrderItem[] = []
) {
  const totalFromItems = getOrderTotalFromItems(items);
  const totalAmount = order
    ? getOrderTotal(order) > 0
      ? getOrderTotal(order)
      : totalFromItems
    : 0;
  const paidAmount = order ? getOrderPaidAmount(order) : 0;
  const remainingAmount = Math.max(0, totalAmount - paidAmount);
  return { totalAmount, paidAmount, remainingAmount };
}

export interface GroupedOrderItem {
  key: string;
  productName: string;
  unitPrice: number;
  allItems: OrderItem[];
  statuses: Record<string, { qty: number; items: OrderItem[] }>;
  totalQty: number;
  totalDelivered: number;
  totalPrice: number;
}

const STATUS_ORDER = ["PENDING", "PREPARING", "READY", "DELIVERED", "CANCELLED"];

export function groupOrderItems(items: OrderItem[] = []): GroupedOrderItem[] {
  const map = new Map<string, GroupedOrderItem>();

  items
    .filter((item) => item.status !== "CANCELLED")
    .forEach((item) => {
      const key = getItemProductName(item) || String(item.id);
      if (!map.has(key)) {
        map.set(key, {
          key,
          productName: getItemProductName(item),
          unitPrice: getItemUnitPrice(item),
          allItems: [],
          statuses: {},
          totalQty: 0,
          totalDelivered: 0,
          totalPrice: 0,
        });
      }

      const group = map.get(key)!;
      group.allItems.push(item);
      group.totalQty += item.quantity ?? 1;
      group.totalDelivered += getItemDeliveredQuantity(item);
      group.totalPrice += getItemTotalPrice(item);

      const status = item.status ?? "PENDING";
      if (!group.statuses[status]) {
        group.statuses[status] = { qty: 0, items: [] };
      }
      group.statuses[status].qty += item.quantity ?? 1;
      group.statuses[status].items.push(item);
    });

  return Array.from(map.values()).sort((a, b) => {
    const aMaxId = Math.max(...a.allItems.map((i) => i.id ?? 0));
    const bMaxId = Math.max(...b.allItems.map((i) => i.id ?? 0));
    return bMaxId - aMaxId;
  });
}

export function getGroupedStatusOrder() {
  return STATUS_ORDER;
}

export function isOrderFullyDelivered(items: OrderItem[] = []) {
  const active = items.filter((i) => i.status !== "CANCELLED");
  if (active.length === 0) return false;
  return active.every((item) => getItemDeliveredQuantity(item) >= (item.quantity ?? 1));
}
