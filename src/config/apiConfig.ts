import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { getNetworkErrorMessage, isNetworkError } from "@/utils/apiErrorMessages";
import type { Translations } from "@/types";

export const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8088/api/v1",
  TIMEOUT: 30000,
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
} as const;

export const API_BASE_URL = API_CONFIG.BASE_URL;

export const PUBLIC_ENDPOINTS = [
  "/auth/google",
  "/auth/apple",
  "/auth/register",
  "/auth/login",
  "/auth/verify-email",
  "/auth/resend-activation",
  "/employees/login",
] as const;

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

export function isPublicEndpoint(url?: string): boolean {
  if (!url) return false;
  return PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

type ClearSessionAction = () => { type: string };

interface InterceptorStore {
  getState: () => {
    user: {
      accessToken: string | null;
      translations: Translations;
    };
  };
  dispatch: (action: unknown) => unknown;
}

export const setupInterceptors = (
  store: InterceptorStore,
  clearSessionAction: ClearSessionAction
) => {
  apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const { setLoading } = await import("@/presentation/state/apiStatusSlice");
      store.dispatch(setLoading(true));

      if (!isPublicEndpoint(config.url)) {
        const state = store.getState();
        let token = state.user.accessToken;

        if (!token) {
          try {
            const SessionManager = (await import("@/utils/SessionManager")).default;
            token = await SessionManager.getInstance().getAccessToken();
          } catch (error) {
            console.error("Error getting token from localStorage:", error);
          }
        }

        if (token) {
          config.headers.Authorization = token;
        }
      } else {
        delete config.headers.Authorization;
      }

      return config;
    },
    async (error: AxiosError) => {
      const { setLoading } = await import("@/presentation/state/apiStatusSlice");
      store.dispatch(setLoading(false));
      return Promise.reject(error);
    }
  );

  apiClient.interceptors.response.use(
    async (response) => {
      const { setLoading, setApiStatus } = await import(
        "@/presentation/state/apiStatusSlice"
      );
      store.dispatch(setLoading(false));
      store.dispatch(setApiStatus(response.status));
      return response;
    },
    async (error: AxiosError<{ message?: string }>) => {
      const { setLoading, setApiError } = await import(
        "@/presentation/state/apiStatusSlice"
      );
      const state = store.getState();
      const translations = state.user.translations;

      store.dispatch(setLoading(false));

      if (error.response) {
        const status = error.response.status;
        const url = error.config?.url || "Unknown endpoint";

        store.dispatch(
          setApiError({
            status,
            message: error.response.data?.message || error.message,
            url,
          })
        );

        if (status === 401) {
          const isModuleSubscriptionCheck = url.includes("/module-subscription");
          if (!isModuleSubscriptionCheck) {
            toast.error(translations.sessionInvalidTitle, {
              description: translations.sessionInvalidBody,
            });

            store.dispatch(clearSessionAction());

            try {
              const SessionManager = (await import("@/utils/SessionManager")).default;
              await SessionManager.getInstance().clearSession();
            } catch (sessionError) {
              console.error("Error clearing session:", sessionError);
            }

            (error as AxiosError & { sessionExpired?: boolean }).sessionExpired = true;
          }
        } else if (status >= 500) {
          toast.error(translations.networkErrorTitle, {
            description: translations.networkErrorBody,
          });
        }
      } else if (error.request || isNetworkError(error)) {
        const networkMessage = getNetworkErrorMessage(translations);
        const requestUrl = error.config?.url || "";

        store.dispatch(
          setApiError({
            status: 0,
            message: networkMessage,
            url: requestUrl || "Unknown endpoint",
          })
        );

        if (!isPublicEndpoint(requestUrl)) {
          toast.error(translations.networkErrorTitle, {
            description: networkMessage,
          });
        }
      } else {
        store.dispatch(
          setApiError({
            status: -1,
            message: error.message,
            url: error.config?.url || "Unknown endpoint",
          })
        );
      }

      return Promise.reject(error);
    }
  );
};

export default apiClient;
export { apiClient };
