import { apiClient } from "@/config/apiConfig";
import type { GenericResponse, ProductCategoryGroup, Translations } from "@/types";

class ProductCategoryRepositoryImpl {
  private translations: Translations;

  constructor(translations: Translations, _token?: string | null) {
    this.translations = translations;
  }

  async getCategoriesByBusiness(businessId: number) {
    const response = await apiClient.get<GenericResponse<ProductCategoryGroup[]>>(
      `/product-category/business/${businessId}`
    );
    if (response.data.meta?.business_code === 0) {
      return response.data.data ?? [];
    }
    throw new Error(this.translations.unexpectedErrorOccurred);
  }

  async createCustomCategory(businessId: number, label: string) {
    const response = await apiClient.post<GenericResponse>(
      `/product-category/custom`,
      {
        business_id: businessId,
        label: label.trim(),
      }
    );
    if (response.data.meta?.business_code === 0) {
      return response.data.data;
    }
    throw new Error(this.translations.createFailed);
  }
}

export default ProductCategoryRepositoryImpl;
