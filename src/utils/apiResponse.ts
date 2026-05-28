import type { GenericResponse } from "@/types";

export function isGenericResponse<T = unknown>(
  value: unknown
): value is GenericResponse<T> {
  return !!value && typeof value === "object" && "meta" in value;
}

export function getResponseData<T>(value: unknown): T | null {
  if (isGenericResponse<T>(value) && value.meta?.business_code === 0) {
    return (value.data as T) ?? null;
  }
  return null;
}

export function isSuccessResponse(value: unknown): boolean {
  return isGenericResponse(value) && value.meta?.business_code === 0;
}

export function isActionSuccess(value: unknown): boolean {
  if (isGenericResponse(value)) {
    return value.meta?.business_code === 0;
  }
  if (value && typeof value === "object" && "success" in value) {
    return (value as { success?: boolean }).success !== false;
  }
  return false;
}

export function getActionMessage(value: unknown, fallback = ""): string {
  if (value && typeof value === "object") {
    if ("message" in value && typeof (value as { message?: string }).message === "string") {
      return (value as { message: string }).message;
    }
    if (isGenericResponse(value) && value.meta?.message) {
      return value.meta.message;
    }
  }
  return fallback;
}
