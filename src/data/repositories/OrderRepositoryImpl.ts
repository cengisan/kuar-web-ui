import { apiClient } from "@/config/apiConfig";
import type { GenericResponse, Order, Translations } from "@/types";
import { normalizeKitchenOrder, normalizeOrder } from "@/utils/order";

function mapOrder(raw: unknown): Order {
  return normalizeOrder(raw as Record<string, unknown>);
}

function mapOrders(raw: unknown): Order[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => mapOrder(item));
}

function mapKitchenOrders(raw: unknown): Order[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) =>
    normalizeKitchenOrder(item as Record<string, unknown>)
  );
}

class OrderRepositoryImpl {
  private translations: Translations;

  constructor(translations: Translations, _accessToken?: string | null) {
    this.translations = translations;
  }

  async getOrders() {
    try {
      const response = await apiClient.get<GenericResponse<Order[]>>("/orders");
      if (response.data?.meta?.business_code === 0) {
        return { success: true, orders: mapOrders(response.data.data) };
      }
      return {
        success: false,
        message: response.data?.meta?.message || this.translations.error,
      };
    } catch (error) {
      const axiosError = error as {
        response?: { data?: GenericResponse };
      };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.error,
      };
    }
  }

  async getActiveOrders() {
    try {
      const response = await apiClient.get<GenericResponse<Order[]>>("/orders/active");
      if (response.data?.meta?.business_code === 0) {
        return { success: true, orders: mapOrders(response.data.data) };
      }
      return {
        success: false,
        message: response.data?.meta?.message || this.translations.error,
      };
    } catch (error) {
      const axiosError = error as {
        response?: { data?: GenericResponse };
      };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.error,
      };
    }
  }

  async getOrder(orderId: number) {
    try {
      const response = await apiClient.get<GenericResponse<Order>>(`/orders/${orderId}`);
      if (response.data?.meta?.business_code === 0) {
        return { success: true, order: mapOrder(response.data.data) };
      }
      return {
        success: false,
        message: response.data?.meta?.message || this.translations.error,
      };
    } catch (error) {
      const axiosError = error as {
        response?: { data?: GenericResponse };
      };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.error,
      };
    }
  }

  async getOrdersByTable(tableId: number) {
    try {
      const response = await apiClient.get<GenericResponse<Order[]>>(
        `/orders/table/${tableId}`
      );
      if (response.data?.meta?.business_code === 0) {
        return { success: true, orders: mapOrders(response.data.data) };
      }
      return {
        success: false,
        message: response.data?.meta?.message || this.translations.error,
      };
    } catch (error) {
      const axiosError = error as {
        response?: { data?: GenericResponse };
      };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.error,
      };
    }
  }

  async getActiveOrderByTable(tableId: number) {
    try {
      const response = await apiClient.get<GenericResponse<Order>>(
        `/orders/table/${tableId}/active`
      );
      if (response.data?.meta?.business_code === 0) {
        return { success: true, order: mapOrder(response.data.data) };
      }
      return {
        success: false,
        message: response.data?.meta?.message || this.translations.error,
      };
    } catch (error) {
      const axiosError = error as {
        response?: { data?: GenericResponse };
      };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.error,
      };
    }
  }

  async getKitchenOrders() {
    try {
      const response = await apiClient.get<GenericResponse<Order[]>>("/orders/kitchen");
      if (response.data?.meta?.business_code === 0) {
        return { success: true, orders: mapKitchenOrders(response.data.data) };
      }
      return {
        success: false,
        message: response.data?.meta?.message || this.translations.error,
      };
    } catch (error) {
      const axiosError = error as {
        response?: { data?: GenericResponse };
      };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.error,
      };
    }
  }

  async getKitchenOrdersByBusiness(businessId: number) {
    try {
      const response = await apiClient.get<GenericResponse<Order[]>>(
        `/orders/kitchen/business/${businessId}`
      );
      if (response.data?.meta?.business_code === 0) {
        return {
          success: true,
          orders: mapKitchenOrders(response.data.data),
        };
      }
      return {
        success: false,
        message: response.data?.meta?.message || this.translations.error,
      };
    } catch (error) {
      const axiosError = error as {
        response?: { data?: GenericResponse };
      };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.error,
      };
    }
  }

  async createOrder(orderData: Record<string, unknown>) {
    try {
      const response = await apiClient.post<GenericResponse<Order>>("/orders", orderData);
      if (response.data?.meta?.business_code === 0) {
        return { success: true, order: mapOrder(response.data.data) };
      }
      return {
        success: false,
        message: response.data?.meta?.message || this.translations.createFailed,
      };
    } catch (error) {
      const axiosError = error as {
        response?: { data?: GenericResponse };
      };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.createFailed,
      };
    }
  }

  async updateOrderStatus(orderId: number, status: string) {
    try {
      const response = await apiClient.put<GenericResponse<Order>>(
        `/orders/${orderId}/status`,
        { status }
      );
      if (response.data?.meta?.business_code === 0) {
        return { success: true, order: mapOrder(response.data.data) };
      }
      return {
        success: false,
        message: response.data?.meta?.message || this.translations.updateFailed,
      };
    } catch (error) {
      const axiosError = error as {
        response?: { data?: GenericResponse };
      };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.updateFailed,
      };
    }
  }

  async cancelOrder(orderId: number) {
    try {
      const response = await apiClient.delete<GenericResponse>(`/orders/${orderId}`);
      const meta = response.data?.meta || response.data;
      if (meta?.business_code === 0) {
        return { success: true };
      }
      return {
        success: false,
        message: meta?.message || this.translations.deleteFailed,
      };
    } catch (error) {
      const axiosError = error as {
        response?: { data?: GenericResponse };
      };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.deleteFailed,
      };
    }
  }

  async addItemToOrder(orderId: number, itemData: Record<string, unknown>) {
    try {
      const response = await apiClient.post<GenericResponse<Order>>(
        `/orders/${orderId}/items`,
        itemData
      );
      if (response.data?.meta?.business_code === 0) {
        return { success: true, order: mapOrder(response.data.data) };
      }
      return {
        success: false,
        message: response.data?.meta?.message || this.translations.createFailed,
      };
    } catch (error) {
      const axiosError = error as {
        response?: { data?: GenericResponse };
      };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.createFailed,
      };
    }
  }

  async removeItemFromOrder(orderId: number, itemId: number) {
    try {
      const response = await apiClient.delete<GenericResponse<Order>>(
        `/orders/${orderId}/items/${itemId}`
      );
      if (response.data?.meta?.business_code === 0) {
        return { success: true, order: mapOrder(response.data.data) };
      }
      return {
        success: false,
        message: response.data?.meta?.message || this.translations.deleteFailed,
      };
    } catch (error) {
      const axiosError = error as {
        response?: { data?: GenericResponse };
      };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.deleteFailed,
      };
    }
  }

  async updateItemStatus(
    itemId: number,
    status: string,
    deliveredQuantity: number | null = null
  ) {
    try {
      const body: Record<string, unknown> = { status };
      if (deliveredQuantity != null) body.delivered_quantity = deliveredQuantity;
      const response = await apiClient.put<GenericResponse>(
        `/orders/items/${itemId}/status`,
        body
      );
      if (response.data?.meta?.business_code === 0) {
        return { success: true, item: response.data.data };
      }
      return {
        success: false,
        message: response.data?.meta?.message || this.translations.updateFailed,
      };
    } catch (error) {
      const axiosError = error as {
        response?: { data?: GenericResponse };
      };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.updateFailed,
      };
    }
  }

  async updateItemNote(itemId: number, note: string) {
    try {
      const response = await apiClient.put<GenericResponse>(
        `/orders/items/${itemId}/note`,
        { note }
      );
      if (response.data?.meta?.business_code === 0) {
        return { success: true, item: response.data.data };
      }
      return {
        success: false,
        message: response.data?.meta?.message || this.translations.updateFailed,
      };
    } catch (error) {
      const axiosError = error as {
        response?: { data?: GenericResponse };
      };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.updateFailed,
      };
    }
  }
}

export default OrderRepositoryImpl;
