import { apiClient } from "@/config/apiConfig";
import type { GenericResponse, Translations } from "@/types";

class DeleteAccountRepositoryImpl {
  private translations: Translations;

  constructor(translations: Translations, _accessToken?: string | null) {
    this.translations = translations;
  }

  async sendDeleteAccountEmail(email: string) {
    try {
      const response = await apiClient.post<GenericResponse>(
        `/delete/send-delete-account-email`,
        { email }
      );
      if (response.data.business_code === 0) {
        return response.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async deleteAccount(email: string, token: string) {
    try {
      const response = await apiClient.delete<GenericResponse>(`/delete/delete-account`, {
        data: { email, token },
      });
      if (response.data.business_code === 0) {
        return response.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async cancelDeleteAccount(subscriberId: number) {
    try {
      const response = await apiClient.get<GenericResponse>(
        `/delete/cancel-delete-account/${subscriberId}`
      );
      if (response.data.business_code === 0) {
        return response.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export default DeleteAccountRepositoryImpl;
