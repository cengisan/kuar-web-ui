import { apiClient } from "@/config/apiConfig";
import {
  getNetworkErrorMessage,
  isNetworkError,
  resolveApiErrorMessage,
  sanitizeErrorMessage,
} from "@/utils/apiErrorMessages";
import { normalizeEmployee } from "@/config/permissions";
import type { Employee, GenericResponse, Translations } from "@/types";

class EmployeeRepositoryImpl {
  private translations: Translations;

  constructor(translations: Translations, _accessToken?: string | null) {
    this.translations = translations;
  }

  async login(accessCode: string) {
    try {
      const response = await apiClient.post<GenericResponse>("/employees/login", {
        accessCode,
      });

      if (response.data?.meta?.business_code === 0) {
        return { success: true, data: response.data.data };
      }

      return {
        success: false,
        message: response.data?.meta?.message || this.translations.loginFailed,
      };
    } catch (error) {
      if (isNetworkError(error)) {
        return {
          success: false,
          message: getNetworkErrorMessage(this.translations),
        };
      }

      const axiosError = error as {
        response?: { data?: { meta?: { message?: string } } };
      };

      return {
        success: false,
        message:
          sanitizeErrorMessage(
            axiosError.response?.data?.meta?.message,
            this.translations
          ) ||
          resolveApiErrorMessage(error, this.translations) ||
          this.translations.loginFailed,
      };
    }
  }

  async getEmployees() {
    try {
      const response = await apiClient.get<GenericResponse<Employee[]>>("/employees");
      if (response.data?.meta?.business_code === 0) {
        const raw = response.data.data || [];
        return {
          success: true,
          employees: raw.map((e) =>
            normalizeEmployee(e as unknown as Record<string, unknown>)
          ),
        };
      }
      return {
        success: false,
        message: response.data?.meta?.message || this.translations.error,
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: GenericResponse } };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.error,
      };
    }
  }

  async getEmployeesByBusiness(businessId: number) {
    try {
      const response = await apiClient.get<GenericResponse<Employee[]>>(
        `/employees/business/${businessId}`
      );
      if (response.data?.meta?.business_code === 0) {
        const raw = response.data.data || [];
        return {
          success: true,
          employees: raw.map((e) =>
            normalizeEmployee(e as unknown as Record<string, unknown>)
          ),
        };
      }
      return {
        success: false,
        message: response.data?.meta?.message || this.translations.error,
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: GenericResponse } };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.error,
      };
    }
  }

  async createEmployee(employeeData: Record<string, unknown>) {
    try {
      const response = await apiClient.post<GenericResponse<Employee>>(
        "/employees",
        employeeData
      );
      if (response.data?.meta?.business_code === 0 && response.data.data) {
        return {
          success: true,
          employee: normalizeEmployee(response.data.data as unknown as Record<string, unknown>),
        };
      }
      return {
        success: false,
        message: response.data?.meta?.message || this.translations.createFailed,
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: GenericResponse } };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.createFailed,
      };
    }
  }

  async updateEmployee(employeeId: number, employeeData: Record<string, unknown>) {
    try {
      const response = await apiClient.put<GenericResponse<Employee>>(
        `/employees/${employeeId}`,
        employeeData
      );
      if (response.data?.meta?.business_code === 0 && response.data.data) {
        return {
          success: true,
          employee: normalizeEmployee(response.data.data as unknown as Record<string, unknown>),
        };
      }
      return {
        success: false,
        message:
          response.data?.meta?.message || this.translations.employeeUpdateFailed,
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: GenericResponse } };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message ||
          this.translations.employeeUpdateFailed,
      };
    }
  }

  async deleteEmployee(employeeId: number) {
    try {
      const response = await apiClient.delete<GenericResponse>(
        `/employees/${employeeId}`
      );
      if (response.data?.meta?.business_code === 0) {
        return { success: true };
      }
      return {
        success: false,
        message: response.data?.meta?.message || this.translations.deleteFailed,
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: GenericResponse } };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.deleteFailed,
      };
    }
  }

  async regenerateAccessCode(employeeId: number) {
    try {
      const response = await apiClient.post<GenericResponse<Employee>>(
        `/employees/${employeeId}/regenerate-code`
      );
      if (response.data?.meta?.business_code === 0 && response.data.data) {
        return {
          success: true,
          employee: normalizeEmployee(response.data.data as unknown as Record<string, unknown>),
        };
      }
      return {
        success: false,
        message: response.data?.meta?.message || this.translations.error,
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: GenericResponse } };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.error,
      };
    }
  }
}

export default EmployeeRepositoryImpl;
