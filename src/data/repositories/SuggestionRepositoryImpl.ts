import { apiClient } from "@/config/apiConfig";
import type { Translations } from "@/types";

class SuggestionRepositoryImpl {
  private translations: Translations;

  constructor(translations: Translations, _accessToken?: string | null) {
    this.translations = translations;
  }

  async submitSuggestion(subscriberId: number, suggestion: string) {
    try {
      const response = await apiClient.post(
        `/feedback/send-suggestion/${subscriberId}`,
        { suggestion }
      );

      if (response.status === 200 || response.status === 201) {
        return {
          success: true,
          message: this.translations.suggestionSent,
        };
      }

      return {
        success: false,
        message: this.translations.suggestionFailed,
      };
    } catch (error) {
      console.error("Error submitting suggestion:", error);
      return {
        success: false,
        message: this.translations.suggestionFailed,
      };
    }
  }
}

export default SuggestionRepositoryImpl;
