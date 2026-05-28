import type { Translations } from "@/types";

const TECHNICAL_NETWORK_PATTERNS = [
  /^ERR_NETWORK$/i,
  /^NETWORK_ERROR$/i,
  /^NETWORK ERROR$/i,
  /^ECONNABORTED$/i,
  /^ETIMEDOUT$/i,
  /network request failed/i,
  /network error/i,
];

const isTechnicalNetworkMessage = (value: unknown): boolean => {
  if (!value || typeof value !== "string") {
    return false;
  }
  const normalized = value.trim();
  return TECHNICAL_NETWORK_PATTERNS.some((pattern) => pattern.test(normalized));
};

export const isNetworkError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const axiosError = error as {
    request?: unknown;
    response?: unknown;
    code?: string;
    message?: string;
  };

  if (axiosError.request && !axiosError.response) {
    return true;
  }

  return (
    isTechnicalNetworkMessage(axiosError.code) ||
    isTechnicalNetworkMessage(axiosError.message)
  );
};

export const getNetworkErrorMessage = (translations?: Translations): string =>
  translations?.noInternetConnection ??
  translations?.unableToConnectToServer ??
  translations?.networkErrorBody ??
  "Please check your internet connection and try again.";

export const sanitizeErrorMessage = (
  message: unknown,
  translations?: Translations
): string | undefined => {
  if (typeof message !== "string") {
    return undefined;
  }
  if (isTechnicalNetworkMessage(message)) {
    return getNetworkErrorMessage(translations);
  }
  return message;
};

export const resolveApiErrorMessage = (
  error: unknown,
  translations?: Translations
): string => {
  if (isNetworkError(error)) {
    return getNetworkErrorMessage(translations);
  }

  const axiosError = error as {
    response?: {
      data?: {
        meta?: { message?: string };
        message?: string;
      };
    };
    message?: string;
  };

  const rawMessage =
    axiosError?.response?.data?.meta?.message ??
    axiosError?.response?.data?.message ??
    axiosError?.message ??
    "";

  if (isTechnicalNetworkMessage(rawMessage)) {
    return getNetworkErrorMessage(translations);
  }

  return rawMessage || translations?.unexpectedErrorOccurred || "An unexpected error occurred.";
};
