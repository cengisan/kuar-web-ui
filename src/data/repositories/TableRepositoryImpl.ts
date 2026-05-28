import { apiClient } from "@/config/apiConfig";
import {
  getBulkTableStartIndex,
  sortTablesByNumber,
} from "@/utils/tableNumberSort";
import type { CafeTable, GenericResponse, TableArea, Translations } from "@/types";

function responseBusinessCode(data: GenericResponse | undefined): number | undefined {
  if (!data || typeof data !== "object") return undefined;
  return data.meta?.business_code ?? data.business_code;
}

function responseMetaMessage(data: GenericResponse | undefined): string | undefined {
  if (!data || typeof data !== "object") return undefined;
  return data.meta?.message ?? data.message;
}

class TableRepositoryImpl {
  private translations: Translations;

  constructor(translations: Translations, _accessToken?: string | null) {
    this.translations = translations;
  }

  async getAreas() {
    try {
      const response = await apiClient.get<GenericResponse<TableArea[]>>("/table-areas");
      if (response.data?.meta?.business_code === 0) {
        return { success: true, areas: response.data.data || [] };
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

  async getAreasByBusiness(businessId: number) {
    try {
      const response = await apiClient.get<GenericResponse<TableArea[]>>(
        `/table-areas/business/${businessId}`
      );
      if (response.data?.meta?.business_code === 0) {
        return { success: true, areas: response.data.data || [] };
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

  async createArea(areaData: Record<string, unknown>) {
    try {
      const response = await apiClient.post<GenericResponse<TableArea>>(
        "/table-areas",
        areaData
      );
      if (response.data?.meta?.business_code === 0) {
        return { success: true, area: response.data.data };
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

  async updateArea(areaId: number, areaData: Record<string, unknown>) {
    try {
      const response = await apiClient.put<GenericResponse<TableArea>>(
        `/table-areas/${areaId}`,
        areaData
      );
      if (response.data?.meta?.business_code === 0) {
        return { success: true, area: response.data.data };
      }
      return {
        success: false,
        message: response.data?.meta?.message || this.translations.updateFailed,
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: GenericResponse } };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.updateFailed,
      };
    }
  }

  async deleteArea(areaId: number) {
    try {
      const response = await apiClient.delete<GenericResponse>(`/table-areas/${areaId}`);
      if (responseBusinessCode(response.data) === 0) {
        return { success: true };
      }
      return {
        success: false,
        message:
          responseMetaMessage(response.data) ||
          this.translations.deleteAreaFailed ||
          this.translations.deleteFailed,
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: GenericResponse } };
      return {
        success: false,
        message:
          responseMetaMessage(axiosError.response?.data) ||
          this.translations.deleteAreaFailed ||
          this.translations.deleteFailed,
      };
    }
  }

  async getTables() {
    try {
      const response = await apiClient.get<GenericResponse<CafeTable[]>>(
        "/table-areas/tables"
      );
      if (response.data?.meta?.business_code === 0) {
        return {
          success: true,
          tables: sortTablesByNumber(response.data.data || []),
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

  async getTablesByArea(areaId: number) {
    try {
      const response = await apiClient.get<GenericResponse<CafeTable[]>>(
        `/table-areas/${areaId}/tables`
      );
      if (response.data?.meta?.business_code === 0) {
        return {
          success: true,
          tables: sortTablesByNumber(response.data.data || []),
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

  async createTable(tableData: Record<string, unknown>) {
    try {
      const response = await apiClient.post<GenericResponse<CafeTable>>(
        "/table-areas/tables",
        tableData
      );
      if (response.data?.meta?.business_code === 0) {
        return { success: true, table: response.data.data };
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

  async createTablesBulk({
    prefix,
    count,
    capacity,
    areaId,
    business_id,
    existingTables,
  }: {
    prefix: string;
    count: number;
    capacity: number;
    areaId: number;
    business_id?: number | null;
    existingTables?: CafeTable[];
  }) {
    const base = String(prefix || "")
      .trim()
      .replace(/-+$/, "");
    const created: string[] = [];
    const failed: Array<{ tableNumber: string; message: string }> = [];
    let firstError: string | null = null;

    const cap = Number.isFinite(capacity) && capacity > 0 ? Math.floor(capacity) : 4;
    const n = Math.floor(count);
    const startIndex = getBulkTableStartIndex(base, existingTables ?? []);

    for (let i = 0; i < n; i += 1) {
      const tableNumber = `${base}-${startIndex + i}`;
      const result = await this.createTable({
        tableNumber,
        capacity: cap,
        areaId,
        business_id: business_id ?? null,
      });
      if (result.success) {
        created.push(tableNumber);
      } else {
        failed.push({
          tableNumber,
          message: result.message || this.translations.createFailed,
        });
        if (!firstError) {
          firstError = result.message || this.translations.createFailed;
        }
      }
    }

    return { created, failed, firstError, startIndex };
  }

  async updateTable(tableId: number, tableData: Record<string, unknown>) {
    try {
      const response = await apiClient.put<GenericResponse<CafeTable>>(
        `/table-areas/tables/${tableId}`,
        tableData
      );
      if (response.data?.meta?.business_code === 0) {
        return { success: true, table: response.data.data };
      }
      return {
        success: false,
        message: response.data?.meta?.message || this.translations.updateFailed,
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: GenericResponse } };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.updateFailed,
      };
    }
  }

  async deleteTable(tableId: number) {
    try {
      const response = await apiClient.delete<GenericResponse>(
        `/table-areas/tables/${tableId}`
      );
      if (responseBusinessCode(response.data) === 0) {
        return { success: true };
      }
      return {
        success: false,
        message:
          responseMetaMessage(response.data) ||
          this.translations.deleteTableFailed ||
          this.translations.deleteFailed,
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: GenericResponse } };
      return {
        success: false,
        message:
          responseMetaMessage(axiosError.response?.data) ||
          this.translations.deleteTableFailed ||
          this.translations.deleteFailed,
      };
    }
  }

  async updateTableStatus(
    tableId: number,
    status: string,
    reservationNote?: string | null
  ) {
    try {
      const body: Record<string, unknown> = { status };
      if (reservationNote !== undefined && reservationNote !== null) {
        body.reservationNote = reservationNote;
      }
      const response = await apiClient.put<GenericResponse<CafeTable>>(
        `/table-areas/tables/${tableId}/status`,
        body
      );
      if (response.data?.meta?.business_code === 0) {
        return { success: true, table: response.data.data };
      }
      return {
        success: false,
        message: response.data?.meta?.message || this.translations.updateFailed,
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: GenericResponse } };
      return {
        success: false,
        message:
          axiosError.response?.data?.meta?.message || this.translations.updateFailed,
      };
    }
  }
}

export default TableRepositoryImpl;
