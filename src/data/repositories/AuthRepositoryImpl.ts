import { apiClient } from "@/config/apiConfig";
import {
  getNetworkErrorMessage,
  isNetworkError,
  resolveApiErrorMessage,
  sanitizeErrorMessage,
} from "@/utils/apiErrorMessages";
import type { GenericResponse, RepositoryResult, Translations } from "@/types";

interface AuthErrorResponse {
  business_code?: number;
  message?: string;
}

class AuthRepositoryImpl {
  private translations: Translations;

  constructor(translations: Translations) {
    this.translations = translations;
  }

  async loginWithGoogle(
    idToken: string,
    device?: Record<string, unknown>
  ): Promise<RepositoryResult> {
    try {
      const requestBody: Record<string, unknown> = { token: idToken };
      if (device) requestBody.device = device;

      const response = await apiClient.post<GenericResponse>("/auth/google", requestBody);
      const businessCode =
        response.data.meta?.business_code ?? response.data.business_code;

      if (businessCode === 0) {
        return {
          success: true,
          token: response.data.access_token,
          userData: (response.data.data as Record<string, unknown>) || {},
          message: this.translations.loginSuccessful,
        };
      }

      return { success: false, message: this.translations.loginFailed };
    } catch (error) {
      return this.handleAuthError(error);
    }
  }

  async loginWithGoogleCode(
    code: string,
    redirectUri: string,
    device?: Record<string, unknown>
  ): Promise<RepositoryResult> {
    try {
      const requestBody: Record<string, unknown> = {
        code,
        redirect_uri: redirectUri,
      };
      if (device) requestBody.device = device;

      const response = await apiClient.post<GenericResponse>("/auth/google/code", requestBody);
      const businessCode =
        response.data.meta?.business_code ?? response.data.business_code;

      if (businessCode === 0) {
        return {
          success: true,
          token: response.data.access_token,
          userData: (response.data.data as Record<string, unknown>) || {},
          message: this.translations.loginSuccessful,
        };
      }

      return { success: false, message: this.translations.loginFailed };
    } catch (error) {
      return this.handleAuthError(error);
    }
  }

  async loginWithApple(
    identityToken: string,
    device?: Record<string, unknown>
  ): Promise<RepositoryResult> {
    try {
      const requestBody: Record<string, unknown> = { token: identityToken };
      if (device) requestBody.device = device;

      const response = await apiClient.post<GenericResponse>("/auth/apple", requestBody);
      const businessCode =
        response.data.meta?.business_code ?? response.data.business_code;

      if (businessCode === 0) {
        return {
          success: true,
          token: response.data.access_token,
          userData: (response.data.data as Record<string, unknown>) || {},
          message: this.translations.loginSuccessful,
        };
      }

      return { success: false, message: this.translations.loginFailed };
    } catch (error) {
      return this.handleAuthError(error);
    }
  }

  async logout(accessToken: string): Promise<RepositoryResult> {
    try {
      const response = await apiClient.post<GenericResponse>(
        "/auth/logout",
        { access_token: accessToken },
        {
          headers: { Authorization: accessToken },
        }
      );

      if (response.data.meta?.business_code === 0) {
        return { success: true, message: this.translations.logoutSuccessful };
      }

      return { success: false, message: this.translations.logoutFailed };
    } catch {
      return { success: true, message: this.translations.logoutSuccessful };
    }
  }

  async register(
    name: string,
    email: string,
    password: string,
    device?: Record<string, unknown>
  ): Promise<RepositoryResult> {
    try {
      const requestBody: Record<string, unknown> = { name, email, password };
      if (device) requestBody.device = device;

      const response = await apiClient.post<GenericResponse>("/auth/register", requestBody);
      const businessCode =
        response.data.business_code ?? response.data.meta?.business_code;

      if (businessCode === 0) {
        return {
          success: true,
          message: response.data.message || this.translations.registerSuccess,
        };
      }

      return {
        success: false,
        message: response.data.message || this.translations.unexpectedErrorOccurred,
      };
    } catch (error) {
      if (isNetworkError(error)) {
        return {
          success: false,
          message: getNetworkErrorMessage(this.translations),
        };
      }

      const axiosError = error as {
        response?: { data?: AuthErrorResponse };
      };

      if (axiosError.response) {
        if (axiosError.response.data?.business_code === 1041) {
          return {
            success: false,
            message: this.translations.emailAlreadyExists,
          };
        }
        return {
          success: false,
          message:
            sanitizeErrorMessage(
              axiosError.response.data?.message,
              this.translations
            ) || this.translations.unexpectedErrorOccurred,
        };
      }

      return {
        success: false,
        message: resolveApiErrorMessage(error, this.translations),
      };
    }
  }

  async loginWithEmail(
    email: string,
    password: string,
    device?: Record<string, unknown>
  ): Promise<RepositoryResult> {
    try {
      const requestBody: Record<string, unknown> = { email, password };
      if (device) requestBody.device = device;

      const response = await apiClient.post<GenericResponse>("/auth/login", requestBody);
      const businessCode =
        response.data.meta?.business_code ?? response.data.business_code;

      if (businessCode === 0) {
        return {
          success: true,
          token: response.data.access_token,
          userData: (response.data.data as Record<string, unknown>) || {},
          message: this.translations.loginSuccessful,
        };
      }

      return {
        success: false,
        message: response.data.message || this.translations.loginFailed,
      };
    } catch (error) {
      if (isNetworkError(error)) {
        return {
          success: false,
          message: getNetworkErrorMessage(this.translations),
        };
      }

      const axiosError = error as {
        response?: { data?: { message?: string } };
      };

      if (axiosError.response) {
        const serverMessage = axiosError.response.data?.message;
        return {
          success: false,
          message:
            sanitizeErrorMessage(serverMessage, this.translations) ||
            this.translations.loginFailed,
          needsVerification:
            serverMessage?.includes("doğrulanmamış") ||
            serverMessage?.includes("not verified"),
        };
      }

      return {
        success: false,
        message: resolveApiErrorMessage(error, this.translations),
      };
    }
  }

  async verifyEmail(
    email: string,
    code: string,
    device?: Record<string, unknown>
  ): Promise<RepositoryResult> {
    try {
      const requestBody: Record<string, unknown> = { email, code };
      if (device) requestBody.device = device;

      const response = await apiClient.post<GenericResponse>(
        "/auth/verify-email",
        requestBody
      );
      const businessCode =
        response.data.meta?.business_code ?? response.data.business_code;

      if (businessCode === 0) {
        return {
          success: true,
          token: response.data.access_token,
          userData: (response.data.data as Record<string, unknown>) || {},
          message: this.translations.activationSuccess,
        };
      }

      return {
        success: false,
        message: response.data.message || this.translations.invalidVerificationCode,
      };
    } catch (error) {
      if (isNetworkError(error)) {
        return {
          success: false,
          message: getNetworkErrorMessage(this.translations),
        };
      }

      const axiosError = error as {
        response?: { data?: { message?: string } };
      };

      if (axiosError.response) {
        return {
          success: false,
          message:
            sanitizeErrorMessage(
              axiosError.response.data?.message,
              this.translations
            ) || this.translations.invalidVerificationCode,
        };
      }

      return {
        success: false,
        message: resolveApiErrorMessage(error, this.translations),
      };
    }
  }

  async resendActivationCode(email: string): Promise<RepositoryResult> {
    try {
      const response = await apiClient.post<GenericResponse>("/auth/resend-activation", {
        email,
      });
      const businessCode =
        response.data.business_code ?? response.data.meta?.business_code;

      if (businessCode === 0) {
        return { success: true, message: this.translations.codeSentAgain };
      }

      return {
        success: false,
        message: response.data.message || this.translations.failedToResendCode,
      };
    } catch (error) {
      if (isNetworkError(error)) {
        return {
          success: false,
          message: getNetworkErrorMessage(this.translations),
        };
      }

      const axiosError = error as {
        response?: { data?: { message?: string } };
      };

      if (axiosError.response) {
        return {
          success: false,
          message:
            sanitizeErrorMessage(
              axiosError.response.data?.message,
              this.translations
            ) || this.translations.failedToResendCode,
        };
      }

      return {
        success: false,
        message: resolveApiErrorMessage(error, this.translations),
      };
    }
  }

  private handleAuthError(error: unknown): RepositoryResult {
    if (isNetworkError(error)) {
      return {
        success: false,
        message: getNetworkErrorMessage(this.translations),
      };
    }

    const axiosError = error as {
      response?: { data?: AuthErrorResponse };
    };

    if (axiosError.response) {
      switch (axiosError.response.data?.business_code) {
        case 1006:
          return {
            success: false,
            message: this.translations.tooManyFailedAttempts,
          };
        case 1010:
          return {
            success: false,
            message: this.translations.userDoesNotExist,
          };
        case 1004:
          return {
            success: false,
            message: this.translations.userAccountIsNotActivated,
          };
        default:
          return {
            success: false,
            message:
              sanitizeErrorMessage(
                axiosError.response.data?.message,
                this.translations
              ) || this.translations.loginFailed,
          };
      }
    }

    return {
      success: false,
      message: resolveApiErrorMessage(error, this.translations),
    };
  }
}

export default AuthRepositoryImpl;
