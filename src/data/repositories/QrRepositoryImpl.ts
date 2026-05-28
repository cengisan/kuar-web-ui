import { apiClient } from "@/config/apiConfig";
import type { Translations } from "@/types";

class QrRepositoryImpl {
  private translations: Translations;
  private token?: string;

  constructor(translations: Translations, token?: string | null) {
    this.translations = translations;
    this.token = token ?? undefined;
  }

  async getQrCode(menuId: string): Promise<string> {
    try {
      const response = await apiClient.get<ArrayBuffer>(`/qr-generate/${menuId}`, {
        headers: {
          Accept: "image/jpeg,image/png,image/*",
          "Content-Type": "application/json",
          ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
        },
        responseType: "arraybuffer",
      });

      if (!response.data || response.data.byteLength === 0) {
        throw new Error("QR kod verisi boş veya geçersiz");
      }

      const base64 = arrayBufferToBase64(response.data);
      const mimeType = response.headers["content-type"] || "image/png";
      return `data:${mimeType};base64,${base64}`;
    } catch (error) {
      const axiosError = error as {
        response?: { status?: number; statusText?: string };
        request?: unknown;
        message?: string;
      };

      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 500:
            throw new Error(this.translations.serverError);
          case 404:
            throw new Error(this.translations.menuNotFound);
          case 406:
            throw new Error(this.translations.unsupportedFormat);
          case 401:
            throw new Error(this.translations.unauthorized);
          case 403:
            throw new Error(this.translations.forbidden);
          default:
            throw new Error(
              `HTTP ${axiosError.response.status}: ${axiosError.response.statusText}`
            );
        }
      }

      if (axiosError.request) {
        throw new Error(this.translations.noResponse);
      }

      if (axiosError.message) {
        throw new Error(axiosError.message);
      }

      throw new Error(this.translations.qrGenerationFailed);
    }
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export default QrRepositoryImpl;
