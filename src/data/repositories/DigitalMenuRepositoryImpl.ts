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
    imageFile.name || imageFile.file.name || "image.jpg"
  );
}

class DigitalMenuRepositoryImpl {
  private translations: Translations;

  constructor(translations: Translations, _token?: string | null) {
    this.translations = translations;
  }

  async getAllDigitalMenus(subscriberId: number) {
    try {
      const response = await apiClient.get<GenericResponse>(
        `/digital-menu/get-all/${subscriberId}`
      );
      return response.data;
    } catch (error) {
      const axiosError = error as { response?: { data?: { business_code?: number } } };
      if (axiosError.response) {
        switch (axiosError.response.data?.business_code) {
          case 1015:
            return { success: false, message: this.translations.menuDoesNotExist };
          default:
            return {
              success: false,
              message: this.translations.unexpectedErrorOccurred,
            };
        }
      }
    }
  }

  async getAllDigitalMenusByBusiness(businessId: number) {
    try {
      const response = await apiClient.get<GenericResponse>(
        `/digital-menu/get-all/business/${businessId}`
      );
      return response.data;
    } catch (error) {
      const axiosError = error as { response?: { data?: { business_code?: number } } };
      if (axiosError.response) {
        switch (axiosError.response.data?.business_code) {
          case 1015:
            return {
              success: false,
              data: [],
              message: this.translations.menuDoesNotExist,
            };
          default:
            return {
              success: false,
              data: [],
              message: this.translations.unexpectedErrorOccurred,
            };
        }
      }
      return { success: false, data: [] };
    }
  }

  async updateDigitalMenuImage(
    digitalMenuId: string,
    imageId: number,
    imageFile: ImageUploadInput
  ) {
    try {
      const formData = new FormData();
      appendImageToFormData(formData, imageFile);

      const response = await apiClient.put<GenericResponse>(
        `/digital-menu-image/update/${digitalMenuId}?imageId=${imageId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.meta?.business_code === 0) {
        return {
          success: true,
          message: this.translations.imageUploaded,
          data: response.data,
        };
      }
      return { success: false, message: this.translations.updateFailed };
    } catch (error) {
      const axiosError = error as { response?: { data?: { business_code?: number } } };
      if (axiosError.response) {
        switch (axiosError.response.data?.business_code) {
          case 1015:
            return { success: false, message: this.translations.menuDoesNotExist };
          default:
            return { success: false, message: this.translations.updateFailed };
        }
      }
    }
  }

  async updateDigitalMenu(digitalMenuId: string, data: Record<string, unknown>) {
    try {
      const response = await apiClient.put<GenericResponse>(
        `/digital-menu/update/${digitalMenuId}`,
        data
      );
      if (response.data.meta?.business_code === 0) {
        return {
          success: true,
          message: this.translations.menuUpdated,
          data: response.data,
        };
      }
      return { success: false, message: this.translations.updateFailed };
    } catch (error) {
      const axiosError = error as { response?: { data?: { business_code?: number } } };
      if (axiosError.response) {
        switch (axiosError.response.data?.business_code) {
          case 1015:
            return { success: false, message: this.translations.menuDoesNotExist };
          default:
            return { success: false, message: this.translations.loginFailed };
        }
      }
    }
  }

  async createDigitalMenu(data: Record<string, unknown>) {
    try {
      const response = await apiClient.post<GenericResponse>(`/digital-menu/create`, data);
      if (response.data.meta?.business_code === 0) {
        return {
          success: true,
          message: this.translations.menuCreated,
          data: response.data,
        };
      }
      return { success: false, message: this.translations.createFailed };
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { business_code?: number } };
        request?: unknown;
      };
      if (axiosError.response) {
        switch (axiosError.response.data?.business_code) {
          case 1015:
            return { success: false, message: this.translations.menuDoesNotExist };
          case 1025:
            return { success: false, message: this.translations.menuLimitError };
          default:
            return { success: false, message: this.translations.createFailed };
        }
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

  async uploadDigitalMenuImage(digitalMenuId: string, imageFile: ImageUploadInput) {
    try {
      const formData = new FormData();
      appendImageToFormData(formData, imageFile);

      const response = await apiClient.post<GenericResponse>(
        `/digital-menu-image/upload/${digitalMenuId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.business_code === 0) {
        return {
          success: true,
          message: this.translations.imageUploaded,
          data: response.data,
        };
      }
      return { success: false, message: this.translations.imageUploadFailed };
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { business_code?: number } };
        request?: unknown;
      };
      if (axiosError.response) {
        switch (axiosError.response.data?.business_code) {
          case 1015:
            return { success: false, message: this.translations.menuDoesNotExist };
          default:
            return { success: false, message: this.translations.imageUploadFailed };
        }
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

  async deleteDigitalMenu(digitalMenuId: string) {
    try {
      const response = await apiClient.delete<GenericResponse>(
        `/digital-menu/delete/${digitalMenuId}`
      );
      if (response.data.business_code === 0) {
        return {
          success: true,
          message: this.translations.menuDeleted,
          data: response.data,
        };
      }
      return { success: false, message: this.translations.deleteFailed };
    } catch (error) {
      const axiosError = error as { response?: { data?: { business_code?: number } } };
      if (axiosError.response) {
        switch (axiosError.response.data?.business_code) {
          case 1000:
            return { success: false, message: this.translations.unauthorized };
          case 1015:
            return { success: false, message: this.translations.menuDoesNotExist };
          default:
            return { success: false, message: this.translations.deleteFailed };
        }
      }
      return {
        success: false,
        message: this.translations.unexpectedErrorOccurred,
      };
    }
  }

  async deleteDigitalMenuImage(imageId: number) {
    try {
      const response = await apiClient.delete<GenericResponse>(
        `/digital-menu-image/delete/${imageId}`
      );
      if (response.data.business_code === 0) {
        return {
          success: true,
          message: this.translations.imageDeleted,
          data: response.data,
        };
      }
      return { success: false, message: this.translations.deleteImageFailed };
    } catch (error) {
      const axiosError = error as { response?: { data?: { business_code?: number } } };
      if (axiosError.response) {
        switch (axiosError.response.data?.business_code) {
          case 1000:
            return { success: false, message: this.translations.unauthorized };
          case 1018:
            return { success: false, message: this.translations.imageDoesNotExist };
          default:
            return { success: false, message: this.translations.deleteImageFailed };
        }
      }
    }
  }
}

export default DigitalMenuRepositoryImpl;
