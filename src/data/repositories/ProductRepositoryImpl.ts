import { apiClient } from "@/config/apiConfig";
import type { GenericResponse, ImageUploadInput, Translations } from "@/types";

function appendImageToFormData(formData: FormData, imageFile: ImageUploadInput): void {
  if (imageFile instanceof File) {
    formData.append("image", imageFile);
    return;
  }
  formData.append(
    "image",
    imageFile.file,
    imageFile.name || imageFile.file.name || "product_image.jpg"
  );
}

class ProductRepositoryImpl {
  private translations: Translations;

  constructor(translations: Translations, _token?: string | null) {
    this.translations = translations;
  }

  async getProducts(businessId: number) {
    try {
      const response = await apiClient.get<GenericResponse>(
        `/product/business/${businessId}`
      );
      if (response.data.meta?.business_code === 0) {
        return response.data;
      }
      throw new Error(this.translations.getProductsFailed);
    } catch (error) {
      const axiosError = error as { response?: { data?: { business_code?: number } } };
      if (axiosError.response) {
        switch (axiosError.response.data?.business_code) {
          case 1000:
            return { success: false, message: this.translations.unauthorized };
          case 1016:
            return {
              success: false,
              message: this.translations.menuProductDoesNotExist,
            };
          default:
            return { success: false, message: this.translations.getProductsFailed };
        }
      }
    }
  }

  async updateProduct(
    productId: number,
    businessId: number,
    productData: Record<string, unknown>
  ) {
    const { currency: _currency, ...rest } = productData;
    try {
      const response = await apiClient.put<GenericResponse>(
        `/product/update-product/${productId}`,
        {
          ...rest,
          business_id: businessId ?? rest.business_id,
        }
      );
      if (response.data.meta?.business_code === 0) {
        return response.data;
      }
      throw new Error(this.translations.updateFailed);
    } catch (error) {
      const axiosError = error as { response?: { data?: { business_code?: number } } };
      if (axiosError.response) {
        switch (axiosError.response.data?.business_code) {
          case 1000:
            return { success: false, message: this.translations.unauthorized };
          default:
            return { success: false, message: this.translations.updateFailed };
        }
      }
      throw error;
    }
  }

  async uploadProductImage(productId: number, imageFile: ImageUploadInput) {
    try {
      const formData = new FormData();
      appendImageToFormData(formData, imageFile);

      const response = await apiClient.post<GenericResponse>(
        `/product-image/upload/${productId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.business_code === 0) {
        return response.data;
      }
      throw new Error(this.translations.uploadFailed);
    } catch (error) {
      const axiosError = error as { response?: { data?: { business_code?: number } } };
      if (axiosError.response) {
        switch (axiosError.response.data?.business_code) {
          case 1000:
            return { success: false, message: this.translations.unauthorized };
          default:
            return { success: false, message: this.translations.uploadFailed };
        }
      }
      throw error;
    }
  }

  async updateProductImage(
    productId: number,
    imageId: number,
    imageFile: ImageUploadInput
  ) {
    try {
      const formData = new FormData();
      appendImageToFormData(formData, imageFile);

      const response = await apiClient.put<GenericResponse>(
        `/product-image/update/${productId}?imageId=${imageId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.business_code === 0) {
        return response.data;
      }
      throw new Error(this.translations.updateFailed);
    } catch (error) {
      const axiosError = error as { response?: { data?: { business_code?: number } } };
      if (axiosError.response) {
        switch (axiosError.response.data?.business_code) {
          case 1000:
            return { success: false, message: this.translations.unauthorized };
          default:
            return { success: false, message: this.translations.updateFailed };
        }
      }
      throw error;
    }
  }

  async deleteProductImage(imageId: number) {
    try {
      const response = await apiClient.delete<GenericResponse>(
        `/product-image/delete/${imageId}`
      );
      if (response.data.business_code === 0) {
        return response.data;
      }
      throw new Error(this.translations.deleteFailed);
    } catch (error) {
      const axiosError = error as { response?: { data?: { business_code?: number } } };
      if (axiosError.response) {
        switch (axiosError.response.data?.business_code) {
          case 1000:
            return { success: false, message: this.translations.unauthorized };
          default:
            return { success: false, message: this.translations.deleteFailed };
        }
      }
      throw error;
    }
  }

  async deleteProduct(productId: number) {
    try {
      const response = await apiClient.delete<GenericResponse>(
        `/product/delete-product/${productId}`
      );
      if (response.data.business_code === 0) {
        return response.data;
      }
      throw new Error(this.translations.deleteFailed);
    } catch (error) {
      const axiosError = error as { response?: { data?: { business_code?: number } } };
      if (axiosError.response) {
        switch (axiosError.response.data?.business_code) {
          case 1000:
            return { success: false, message: this.translations.unauthorized };
          default:
            return { success: false, message: this.translations.deleteFailed };
        }
      }
      throw error;
    }
  }

  async createProduct(
    subscriberId: number,
    businessId: number,
    productData: Record<string, unknown>
  ) {
    const { currency: _currency, ...rest } = productData;
    try {
      const response = await apiClient.post<GenericResponse>(`/product/create-product`, {
        ...rest,
        subscriber_id: subscriberId,
        business_id: businessId,
      });

      if (response.data.meta?.business_code === 0) {
        return response.data;
      }
      throw new Error(this.translations.createFailed);
    } catch (error) {
      const axiosError = error as { response?: { data?: { business_code?: number } } };
      if (axiosError.response) {
        switch (axiosError.response.data?.business_code) {
          case 1000:
            return { success: false, message: this.translations.unauthorized };
          default:
            return { success: false, message: this.translations.createFailed };
        }
      }
      throw error;
    }
  }
}

export default ProductRepositoryImpl;
