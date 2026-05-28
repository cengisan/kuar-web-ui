import { apiClient } from "@/config/apiConfig";
import type { GenericResponse, Translations } from "@/types";
import {
  normalizeDashboard,
  normalizePaymentSlice,
  normalizeTopProduct,
  normalizeWeeklyRevenue,
} from "@/utils/dashboard";

class ReportRepositoryImpl {
  private translations: Translations;

  constructor(translations: Translations, _accessToken?: string | null) {
    this.translations = translations;
  }

  async getDashboardData(businessId: number, period = "today") {
    try {
      const response = await apiClient.get<GenericResponse>("/reports/dashboard", {
        params: { businessId, period },
      });
      if (response.data?.meta?.business_code === 0) {
        return {
          success: true,
          data: normalizeDashboard(response.data.data),
        };
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

  async getDailySummary(businessId: number, date: string) {
    try {
      const response = await apiClient.get<GenericResponse>("/reports/daily", {
        params: { businessId, date },
      });
      if (response.data?.meta?.business_code === 0) {
        return { success: true, data: response.data.data };
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

  async getWeeklySummary(businessId: number, startDate: string, endDate: string) {
    try {
      const response = await apiClient.get<GenericResponse>("/reports/weekly", {
        params: { businessId, start: startDate, end: endDate },
      });
      if (response.data?.meta?.business_code === 0) {
        return {
          success: true,
          data: normalizeWeeklyRevenue(response.data.data),
        };
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

  async getMonthlySummary(businessId: number, year: number, month: number) {
    try {
      const response = await apiClient.get<GenericResponse>("/reports/monthly", {
        params: { businessId, year, month },
      });
      if (response.data?.meta?.business_code === 0) {
        return {
          success: true,
          data: normalizeWeeklyRevenue(response.data.data),
        };
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

  async getProductAnalysis(businessId: number, period = "today") {
    try {
      const response = await apiClient.get<GenericResponse>("/reports/products", {
        params: { businessId, period },
      });
      if (response.data?.meta?.business_code === 0) {
        const items = Array.isArray(response.data.data) ? response.data.data : [];
        return {
          success: true,
          data: items.map((item) => normalizeTopProduct(item)),
        };
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

  async exportReport(businessId: number, period = "3months") {
    try {
      const response = await apiClient.get<string>("/reports/export", {
        params: { businessId, period },
        responseType: "text",
        headers: {
          Accept: "text/html",
          "Content-Type": "text/html",
        },
        transformResponse: [(data) => data],
      });

      return { success: true, data: response.data };
    } catch (error) {
      const axiosError = error as { response?: { data?: GenericResponse } };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.fetchFailed,
      };
    }
  }

  async getPaymentMethodBreakdown(businessId: number, period = "today") {
    try {
      const response = await apiClient.get<GenericResponse>(
        "/reports/payment-methods",
        { params: { businessId, period } }
      );
      if (response.data?.meta?.business_code === 0) {
        const items = Array.isArray(response.data.data) ? response.data.data : [];
        return {
          success: true,
          data: items.map((item) => normalizePaymentSlice(item)),
        };
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

export default ReportRepositoryImpl;
