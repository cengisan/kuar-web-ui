import { apiClient } from "@/config/apiConfig";
import type { GenericResponse, Payment, Translations } from "@/types";

class PaymentRepositoryImpl {
  private translations: Translations;

  constructor(translations: Translations, _accessToken?: string | null) {
    this.translations = translations;
  }

  async processFullPayment(orderId: number, method: string, amount: number | null = null) {
    try {
      const payload: Record<string, unknown> = { orderId, method };
      if (amount !== null) payload.amount = amount;

      const response = await apiClient.post<GenericResponse<Payment>>("/payments", payload);
      if (response.data?.meta?.business_code === 0) {
        return { success: true, payment: response.data.data };
      }
      return {
        success: false,
        message: response.data?.meta?.message || this.translations.paymentFailed,
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: GenericResponse } };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.paymentFailed,
      };
    }
  }

  async processPartialPayment(
    orderId: number,
    itemIdsOrItemsWithQuantity:
      | number[]
      | Array<{ itemId: number; quantity: number }>,
    method: string
  ) {
    try {
      const isQuantityBased =
        Array.isArray(itemIdsOrItemsWithQuantity) &&
        itemIdsOrItemsWithQuantity.length > 0 &&
        typeof itemIdsOrItemsWithQuantity[0] === "object" &&
        itemIdsOrItemsWithQuantity[0] != null &&
        "itemId" in itemIdsOrItemsWithQuantity[0] &&
        "quantity" in itemIdsOrItemsWithQuantity[0];

      const body: Record<string, unknown> = { orderId, method };
      if (isQuantityBased) {
        body.itemsWithQuantity = itemIdsOrItemsWithQuantity;
      } else {
        body.itemIds = itemIdsOrItemsWithQuantity;
      }

      const response = await apiClient.post<GenericResponse<Payment>>(
        "/payments/partial",
        body
      );
      if (response.data?.meta?.business_code === 0) {
        return { success: true, payment: response.data.data };
      }
      return {
        success: false,
        message: response.data?.meta?.message || this.translations.paymentFailed,
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: GenericResponse } };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.paymentFailed,
      };
    }
  }

  async processMixedPayment(
    orderId: number,
    payments: Array<Record<string, unknown>>
  ) {
    try {
      const response = await apiClient.post<GenericResponse<Payment[]>>(
        "/payments/mixed",
        { orderId, payments }
      );
      if (response.data?.meta?.business_code === 0) {
        return { success: true, payments: response.data.data };
      }
      return {
        success: false,
        message: response.data?.meta?.message || this.translations.paymentFailed,
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: GenericResponse } };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.paymentFailed,
      };
    }
  }

  async getPaymentsByOrder(orderId: number) {
    try {
      const response = await apiClient.get<GenericResponse<Payment[]>>(
        `/payments/order/${orderId}`
      );
      if (response.data?.meta?.business_code === 0) {
        return { success: true, payments: response.data.data };
      }
      return {
        success: false,
        message: response.data?.meta?.message || this.translations.fetchFailed,
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: GenericResponse } };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.fetchFailed,
      };
    }
  }

  async closeOrder(orderId: number) {
    try {
      const response = await apiClient.post<GenericResponse>(
        `/orders/${orderId}/close`
      );
      if (response.data?.meta?.business_code === 0) {
        return { success: true, orderLog: response.data.data };
      }
      return {
        success: false,
        message: response.data?.meta?.message || this.translations.closeFailed,
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: GenericResponse } };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.closeFailed,
      };
    }
  }

  async refundPayment(paymentId: number) {
    try {
      const response = await apiClient.post<GenericResponse<Payment>>(
        `/payments/${paymentId}/refund`
      );
      if (response.data?.meta?.business_code === 0) {
        return { success: true, payment: response.data.data };
      }
      return {
        success: false,
        message: response.data?.meta?.message || this.translations.refundFailed,
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: GenericResponse } };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.refundFailed,
      };
    }
  }

  async getOrderLogs() {
    try {
      const response = await apiClient.get<GenericResponse>("/payments/order-logs");
      if (response.data?.meta?.business_code === 0) {
        return { success: true, logs: response.data.data };
      }
      return {
        success: false,
        message: response.data?.meta?.message || this.translations.fetchFailed,
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: GenericResponse } };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.fetchFailed,
      };
    }
  }
}

export default PaymentRepositoryImpl;
