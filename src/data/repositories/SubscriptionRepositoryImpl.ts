import { apiClient } from "@/config/apiConfig";
import type { GenericResponse, Translations } from "@/types";

class SubscriptionRepositoryImpl {
  private translations: Translations;
  private token?: string;

  constructor(translations: Translations, token?: string | null) {
    this.translations = translations;
    this.token = token ?? undefined;
  }

  async getAvailableModules(subscriberId: number) {
    try {
      const response = await apiClient.get<GenericResponse>(
        `/module-subscription/modules`,
        { params: { subscriberId } }
      );
      if (response.data.meta?.business_code === 0) {
        return response.data;
      }
      throw new Error(response.data.meta?.message);
    } catch (error) {
      const axiosError = error as { response?: { data?: GenericResponse } };
      if (axiosError.response) {
        throw new Error(
          axiosError.response.data?.meta?.message ||
            this.translations.unexpectedErrorOccurred
        );
      }
      throw error;
    }
  }

  async getRecommendedBundle(subscriberId: number) {
    try {
      const response = await apiClient.get<GenericResponse>(
        `/module-subscription/bundle`,
        { params: { subscriberId } }
      );
      if (response.data.meta?.business_code === 0) {
        return response.data;
      }
      throw new Error(response.data.meta?.message);
    } catch (error) {
      const axiosError = error as { response?: { data?: GenericResponse } };
      if (axiosError.response) {
        throw new Error(
          axiosError.response.data?.meta?.message ||
            this.translations.unexpectedErrorOccurred
        );
      }
      throw error;
    }
  }

  async purchaseModules(payload: Record<string, unknown>) {
    try {
      const response = await apiClient.post<GenericResponse>(
        `/module-subscription/purchase`,
        payload
      );
      if (response.data.meta?.business_code === 0) {
        return response.data;
      }
      throw new Error(response.data.meta?.message);
    } catch (error) {
      const axiosError = error as {
        response?: { data?: GenericResponse & { error?: string } };
      };
      if (axiosError.response) {
        const errorData = axiosError.response.data;
        throw new Error(
          errorData?.meta?.message ||
            errorData?.error ||
            this.translations.paymentFailed
        );
      }
      throw error;
    }
  }

  async getTrialStatus(subscriberId: number) {
    try {
      const response = await apiClient.get<GenericResponse>(
        `/module-subscription/trial-status/${subscriberId}`
      );
      if (response.data.meta?.business_code === 0) {
        return response.data;
      }
      throw new Error(response.data.meta?.message);
    } catch (error) {
      const axiosError = error as { response?: { data?: GenericResponse } };
      if (axiosError.response) {
        throw new Error(
          axiosError.response.data?.meta?.message ||
            this.translations.unexpectedErrorOccurred
        );
      }
      throw error;
    }
  }

  async getExpiryInfo(subscriberId: number) {
    try {
      const response = await apiClient.get<GenericResponse>(
        `/module-subscription/expiry-info/${subscriberId}`
      );
      if (response.data.meta?.business_code === 0) {
        return response.data;
      }
      throw new Error(response.data.meta?.message);
    } catch (error) {
      const axiosError = error as { response?: { data?: GenericResponse } };
      if (axiosError.response) {
        throw new Error(
          axiosError.response.data?.meta?.message ||
            this.translations.unexpectedErrorOccurred
        );
      }
      throw error;
    }
  }

  async getSubscribedModules(subscriberId: number) {
    try {
      const response = await apiClient.get<GenericResponse>(
        `/module-subscription/my-modules/${subscriberId}`
      );
      if (response.data.meta?.business_code === 0) {
        return response.data;
      }
      throw new Error(response.data.meta?.message);
    } catch (error) {
      const axiosError = error as { response?: { data?: GenericResponse } };
      if (axiosError.response) {
        throw new Error(
          axiosError.response.data?.meta?.message ||
            this.translations.unexpectedErrorOccurred
        );
      }
      throw error;
    }
  }

  async hasModuleAccess(subscriberId: number, moduleCode: string) {
    try {
      const response = await apiClient.get<GenericResponse>(
        `/module-subscription/has-access/${subscriberId}/${moduleCode}`
      );
      if (response.data.meta?.business_code === 0) {
        return response.data;
      }
      return { data: false };
    } catch {
      return { data: false };
    }
  }

  async getBusinessLimit(subscriberId: number) {
    try {
      const response = await apiClient.get<GenericResponse>(
        `/module-subscription/business-limit/${subscriberId}`
      );
      if (response.data.meta?.business_code === 0) {
        return response.data;
      }
      return { data: 0 };
    } catch {
      return { data: 0 };
    }
  }
}

export default SubscriptionRepositoryImpl;
