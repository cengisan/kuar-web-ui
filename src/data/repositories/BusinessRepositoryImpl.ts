import { apiClient } from "@/config/apiConfig";
import type { GenericResponse, Translations } from "@/types";

class BusinessRepositoryImpl {
  private translations: Translations;

  constructor(translations: Translations, _token?: string | null) {
    this.translations = translations;
  }

  async getAllBusinesses(subscriberId: number) {
    try {
      const response = await apiClient.get<GenericResponse>(
        `/business/get-all/${subscriberId}`
      );
      return response.data;
    } catch (error) {
      const axiosError = error as { response?: unknown };
      if (axiosError.response) {
        return {
          success: false,
          message: this.translations.unexpectedErrorOccurred,
        };
      }
      throw error;
    }
  }

  async getBusinessById(businessId: number) {
    try {
      const response = await apiClient.get<GenericResponse>(
        `/business/get/${businessId}`
      );
      return response.data;
    } catch (error) {
      const axiosError = error as { response?: unknown };
      if (axiosError.response) {
        return {
          success: false,
          message: this.translations.unexpectedErrorOccurred,
        };
      }
      throw error;
    }
  }

  async createBusiness(data: Record<string, unknown>) {
    try {
      const response = await apiClient.post<GenericResponse>(`/business/create`, data);
      if (response.data.meta?.business_code === 0) {
        return {
          success: true,
          message: this.translations.businessCreated,
          data: response.data,
        };
      }
      return { success: false, message: this.translations.createFailed };
    } catch (error) {
      const axiosError = error as { response?: unknown; request?: unknown };
      if (axiosError.response) {
        return { success: false, message: this.translations.createFailed };
      }
      if (axiosError.request) {
        return {
          success: false,
          message: this.translations.unableToConnectToServer,
        };
      }
      return {
        success: false,
        message: this.translations.unexpectedErrorOccurred,
      };
    }
  }

  async updateBusiness(businessId: number, data: Record<string, unknown>) {
    try {
      const response = await apiClient.put<GenericResponse>(
        `/business/update/${businessId}`,
        data
      );
      if (response.data.meta?.business_code === 0) {
        return {
          success: true,
          message: this.translations.businessUpdated,
          data: response.data,
        };
      }
      return { success: false, message: this.translations.updateFailed };
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { error_description?: string; message?: string } };
      };
      if (axiosError.response) {
        return {
          success: false,
          message:
            axiosError.response.data?.error_description ||
            axiosError.response.data?.message ||
            this.translations.updateFailed,
        };
      }
      throw error;
    }
  }

  async sendBusinessDeletionCode(businessId: number) {
    try {
      const response = await apiClient.post<GenericResponse>(
        `/business/${businessId}/deletion/send-code`
      );
      const meta = response.data;
      if (meta && meta.business_code === 0) {
        return {
          success: true,
          message:
            this.translations.businessDeletionCodeSent,
          data: meta,
        };
      }
      return {
        success: false,
        message:
          this.translations.businessDeletionFailed || this.translations.deleteFailed,
      };
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      if (axiosError.response) {
        return {
          success: false,
          message:
            axiosError.response.data?.message ||
            this.translations.businessDeletionFailed ||
            this.translations.deleteFailed,
        };
      }
      throw error;
    }
  }

  async confirmBusinessDeletion(businessId: number, code: string) {
    try {
      const response = await apiClient.post<GenericResponse>(
        `/business/${businessId}/deletion/confirm`,
        { code }
      );
      const meta = response.data;
      if (meta && meta.business_code === 0) {
        return {
          success: true,
          message: this.translations.businessDeleted,
          data: meta,
        };
      }
      return {
        success: false,
        message:
          this.translations.businessDeletionFailed || this.translations.deleteFailed,
      };
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { error_description?: string; message?: string } };
      };
      if (axiosError.response) {
        return {
          success: false,
          message:
            axiosError.response.data?.error_description ||
            axiosError.response.data?.message ||
            this.translations.businessDeletionFailed ||
            this.translations.deleteFailed,
        };
      }
      throw error;
    }
  }
}

export default BusinessRepositoryImpl;
