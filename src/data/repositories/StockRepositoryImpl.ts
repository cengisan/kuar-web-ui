import { apiClient } from "@/config/apiConfig";
import type { GenericResponse, Translations } from "@/types";

class StockRepositoryImpl {
  private translations: Translations;

  constructor(translations: Translations, _token?: string | null) {
    this.translations = translations;
  }

  async getMaterials(businessId: number) {
    const response = await apiClient.get<GenericResponse>(
      `/stock/materials/${businessId}`
    );
    if (response.data.meta?.business_code === 0) {
      return response.data;
    }
    throw new Error(this.translations.getMaterialsFailed);
  }

  async createMaterial(
    subscriberId: number,
    businessId: number,
    materialData: Record<string, unknown>
  ) {
    const response = await apiClient.post<GenericResponse>(`/material/create`, {
      ...materialData,
      subscriber_id: subscriberId,
      business_id: businessId,
    });
    if (response.data.meta?.business_code === 0) {
      return response.data;
    }
    throw new Error(this.translations.createFailed);
  }

  async updateMaterial(
    materialId: number,
    subscriberId: number,
    businessId: number,
    materialData: Record<string, unknown>
  ) {
    const response = await apiClient.put<GenericResponse>(
      `/material/update/${materialId}`,
      {
        ...materialData,
        subscriber_id: subscriberId,
        business_id: businessId,
      }
    );
    if (response.data.meta?.business_code === 0) {
      return response.data;
    }
    throw new Error(this.translations.updateFailed);
  }

  async addStock(materialId: number, quantity: number, note?: string | null) {
    const response = await apiClient.post<GenericResponse>(
      `/material/${materialId}/add-stock`,
      { quantity, note }
    );
    if (response.data.meta?.business_code === 0) {
      return response.data;
    }
    throw new Error(this.translations.updateFailed);
  }

  async deleteMaterial(materialId: number) {
    const response = await apiClient.delete<GenericResponse>(
      `/material/delete/${materialId}`
    );
    if (response.data.business_code === 0) {
      return response.data;
    }
    throw new Error(this.translations.deleteFailed);
  }

  async getProductStock(businessId: number) {
    const response = await apiClient.get<GenericResponse>(
      `/stock/products/${businessId}`
    );
    if (response.data.meta?.business_code === 0) {
      return response.data;
    }
    throw new Error(this.translations.getProductsFailed);
  }

  async getStockSummary(businessId: number, threshold?: number) {
    const url =
      threshold != null
        ? `/stock/summary/${businessId}?threshold=${threshold}`
        : `/stock/summary/${businessId}`;
    const response = await apiClient.get<GenericResponse>(url);
    if (response.data.meta?.business_code === 0) {
      return response.data;
    }
    throw new Error(this.translations.unexpectedErrorOccurred);
  }

  async getStockMovements(materialId: number) {
    const response = await apiClient.get<GenericResponse>(
      `/stock/movements/${materialId}`
    );
    if (response.data.meta?.business_code === 0) {
      return response.data;
    }
    throw new Error(this.translations.unexpectedErrorOccurred);
  }

  async getAlertSettings(businessId: number) {
    const response = await apiClient.get<GenericResponse>(
      `/stock/alert-settings/${businessId}`
    );
    if (response.data.meta?.business_code === 0) {
      return response.data;
    }
    throw new Error(this.translations.unexpectedErrorOccurred);
  }

  async saveAlertSettings(
    subscriberId: number,
    businessId: number,
    settings: Record<string, unknown>
  ) {
    const response = await apiClient.post<GenericResponse>(`/stock/alert-settings`, {
      ...settings,
      subscriber_id: subscriberId,
      business_id: businessId,
    });
    if (response.data.meta?.business_code === 0) {
      return response.data;
    }
    throw new Error(this.translations.updateFailed);
  }
}

export default StockRepositoryImpl;
