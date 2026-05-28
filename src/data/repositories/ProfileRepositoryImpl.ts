import { apiClient } from "@/config/apiConfig";
import type { GenericResponse, Translations } from "@/types";

interface ProfileUpdateError extends Error {
  business_code?: number;
  error_description?: string;
}

class ProfileRepositoryImpl {
  private translations: Translations;

  constructor(translations: Translations, _token?: string | null) {
    this.translations = translations;
  }

  async getProfile(subscriberId: number) {
    const response = await apiClient.get<GenericResponse>(
      `/subscriber/get-subscriber/${subscriberId}`
    );
    if (response.data.meta?.business_code === 0) {
      return response.data;
    }
    throw new Error(response.data.meta?.message);
  }

  async updateProfile(profile: Record<string, unknown>, subscriberId: number) {
    try {
      const response = await apiClient.put<GenericResponse>(
        `/subscriber/update-subscriber/${subscriberId}`,
        profile
      );
      if (response.data.meta?.business_code === 0) {
        return response.data;
      }

      const businessCode =
        response.data.meta?.business_code || response.data.business_code;
      const errorDescription =
        response.data.meta?.message || response.data.message;
      const error = new Error(errorDescription || "Profile update failed") as ProfileUpdateError;
      error.business_code = businessCode;
      error.error_description = errorDescription;
      throw error;
    } catch (error) {
      const axiosError = error as {
        response?: {
          data?: GenericResponse & { error_description?: string };
        };
      };

      if (axiosError.response?.data) {
        const businessCode =
          axiosError.response.data.meta?.business_code ||
          axiosError.response.data.business_code;
        const errorDescription =
          axiosError.response.data.meta?.message ||
          axiosError.response.data.error_description;

        if (businessCode) {
          const newError = new Error(
            errorDescription || (error as Error).message
          ) as ProfileUpdateError;
          newError.business_code = businessCode;
          newError.error_description = errorDescription;
          throw newError;
        }
      }
      throw error;
    }
  }
}

export default ProfileRepositoryImpl;
