import { apiClient } from "@/config/apiConfig";
import type { GenericResponse, Translations } from "@/types";
import {
  buildSummaryFromFeedbacks,
  normalizeFeedback,
  normalizeFeedbacks,
  normalizeFeedbackSummary,
  type FeedbackSummary,
  type NormalizedFeedback,
} from "@/utils/feedback";

function sortFeedbacks(feedbacks: NormalizedFeedback[]) {
  return [...feedbacks].sort(
    (a, b) =>
      new Date(b.createdDate || 0).getTime() -
      new Date(a.createdDate || 0).getTime()
  );
}

class FeedbackRepositoryImpl {
  private translations: Translations;

  constructor(translations: Translations, _token?: string | null) {
    this.translations = translations;
  }

  async getAllFeedbacks(subscriberId: number) {
    try {
      const response = await apiClient.get<GenericResponse<unknown[]>>(
        `/feedback/get-all/${subscriberId}`
      );
      if (response.data.meta?.business_code === 0) {
        return {
          success: true,
          feedbacks: sortFeedbacks(normalizeFeedbacks(response.data.data)),
        };
      }
      return {
        success: false,
        feedbacks: [],
        message: this.translations.unexpectedErrorOccurred,
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: GenericResponse } };
      return {
        success: false,
        feedbacks: [],
        message:
          axiosError.response?.data?.meta?.message ||
          this.translations.unableToConnectToServer,
      };
    }
  }

  async getAllFeedbacksByBusiness(businessId: number) {
    try {
      const response = await apiClient.get<GenericResponse<unknown[]>>(
        `/feedback/get-all/business/${businessId}`
      );
      if (response.data.meta?.business_code === 0) {
        return {
          success: true,
          feedbacks: sortFeedbacks(normalizeFeedbacks(response.data.data)),
        };
      }
      return {
        success: false,
        feedbacks: [],
        message: this.translations.unexpectedErrorOccurred,
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: GenericResponse } };
      return {
        success: false,
        feedbacks: [],
        message:
          axiosError.response?.data?.meta?.message ||
          this.translations.unableToConnectToServer,
      };
    }
  }

  async getFeedback(feedbackId: number) {
    try {
      const response = await apiClient.get<GenericResponse<unknown[]>>(
        `/feedback/get/${feedbackId}`
      );
      if (response.data.meta?.business_code === 0 && response.data.data?.[0]) {
        return {
          success: true,
          feedback: normalizeFeedback(response.data.data[0]),
        };
      }
      return {
        success: false,
        feedback: null,
        message: this.translations.unexpectedErrorOccurred,
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: GenericResponse } };
      return {
        success: false,
        feedback: null,
        message: axiosError.response?.data?.meta?.message,
      };
    }
  }

  async deleteFeedback(feedbackId: number) {
    try {
      const response = await apiClient.delete<GenericResponse>(
        `/feedback/delete/${feedbackId}`
      );
      if (
        (response.data && response.data.business_code === 0) ||
        response.status === 200
      ) {
        return { success: true, message: response.data?.message };
      }
      return { success: false, message: response.data?.message };
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      return {
        success: false,
        message: axiosError.response?.data?.message,
      };
    }
  }

  async getFeedbackSummary(businessId: number) {
    try {
      const response = await apiClient.get<GenericResponse>(
        `/feedback/summary/business/${businessId}`
      );
      if (response.data.meta?.business_code === 0) {
        return {
          success: true,
          summary: normalizeFeedbackSummary(response.data.data),
        };
      }
      return { success: false, summary: null };
    } catch {
      return { success: false, summary: null };
    }
  }

  async updateFeedbackReadStatus(feedbackId: number, read: boolean) {
    try {
      const response = await apiClient.put<GenericResponse>(
        `/feedback/update-feedback/${feedbackId}?read=${read}`
      );
      if (response.data?.business_code === 0 || response.status === 200) {
        return { success: true, message: response.data?.message };
      }
      return { success: false, message: response.data?.message };
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      return {
        success: false,
        message: axiosError.response?.data?.message,
      };
    }
  }

  async getFeedbackSummaryWithFallback(
    businessId: number,
    feedbacks: NormalizedFeedback[]
  ) {
    const result = await this.getFeedbackSummary(businessId);
    if (result.success && result.summary && result.summary.totalRatings > 0) {
      return result;
    }
    const fallback = buildSummaryFromFeedbacks(feedbacks);
    if (fallback) {
      return { success: true, summary: fallback };
    }
    return result;
  }
}

export type { FeedbackSummary, NormalizedFeedback };

export default FeedbackRepositoryImpl;
