type ThemePreference = "dark" | "light";

class SessionManager {
  private static instance: SessionManager | null = null;

  static readonly ACCESS_TOKEN_KEY = "@access_token";
  static readonly USER_DATA_KEY = "@user_data";
  static readonly SUBSCRIPTION_DATA_KEY = "subscriptionData";
  static readonly THEME_KEY = "@theme_preference";

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  private getStorage(): Storage | null {
    if (typeof window === "undefined") {
      return null;
    }
    return window.localStorage;
  }

  async setToken(token: string): Promise<boolean> {
    try {
      const storage = this.getStorage();
      if (!token || !storage) {
        return false;
      }

      storage.setItem(SessionManager.ACCESS_TOKEN_KEY, token);
      return storage.getItem(SessionManager.ACCESS_TOKEN_KEY) === token;
    } catch {
      return false;
    }
  }

  async setUserData(userData: Record<string, unknown>): Promise<boolean> {
    try {
      const storage = this.getStorage();
      if (!userData || !storage) {
        return false;
      }

      const userDataString = JSON.stringify(userData);
      storage.setItem(SessionManager.USER_DATA_KEY, userDataString);
      return storage.getItem(SessionManager.USER_DATA_KEY) === userDataString;
    } catch {
      return false;
    }
  }

  async getUserData(): Promise<Record<string, unknown> | null> {
    try {
      const storage = this.getStorage();
      if (!storage) {
        return null;
      }

      const userDataString = storage.getItem(SessionManager.USER_DATA_KEY);
      return userDataString ? (JSON.parse(userDataString) as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  }

  async getAccessToken(): Promise<string | null> {
    try {
      const storage = this.getStorage();
      if (!storage) {
        return null;
      }
      return storage.getItem(SessionManager.ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  async setSubscriptionData(subscriptionData: unknown): Promise<boolean> {
    try {
      const storage = this.getStorage();
      if (!storage) {
        return false;
      }

      if (subscriptionData === null || subscriptionData === undefined) {
        storage.removeItem(SessionManager.SUBSCRIPTION_DATA_KEY);
        return true;
      }

      storage.setItem(
        SessionManager.SUBSCRIPTION_DATA_KEY,
        JSON.stringify(subscriptionData)
      );
      return true;
    } catch {
      return false;
    }
  }

  async getSubscriptionData(): Promise<unknown | null> {
    try {
      const storage = this.getStorage();
      if (!storage) {
        return null;
      }

      const subscriptionDataString = storage.getItem(
        SessionManager.SUBSCRIPTION_DATA_KEY
      );
      return subscriptionDataString ? JSON.parse(subscriptionDataString) : null;
    } catch {
      return null;
    }
  }

  async setTheme(theme: ThemePreference): Promise<boolean> {
    try {
      const storage = this.getStorage();
      if (!theme || (theme !== "dark" && theme !== "light") || !storage) {
        return false;
      }

      storage.setItem(SessionManager.THEME_KEY, theme);
      return true;
    } catch {
      return false;
    }
  }

  async getTheme(): Promise<ThemePreference> {
    try {
      const storage = this.getStorage();
      if (!storage) {
        return "dark";
      }

      const theme = storage.getItem(SessionManager.THEME_KEY);
      return theme === "light" ? "light" : "dark";
    } catch {
      return "dark";
    }
  }

  async clearSession(): Promise<boolean> {
    try {
      const storage = this.getStorage();
      if (!storage) {
        return true;
      }

      await this.setSubscriptionData(null);
      storage.removeItem(SessionManager.ACCESS_TOKEN_KEY);
      storage.removeItem(SessionManager.USER_DATA_KEY);
      storage.removeItem(SessionManager.SUBSCRIPTION_DATA_KEY);

      const sessionKeys = [
        SessionManager.ACCESS_TOKEN_KEY,
        SessionManager.USER_DATA_KEY,
        SessionManager.SUBSCRIPTION_DATA_KEY,
      ].filter((key) => storage.getItem(key) !== null);

      if (sessionKeys.length > 0) {
        sessionKeys.forEach((key) => storage.removeItem(key));
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  async forceClearAllSessionData(): Promise<boolean> {
    try {
      await this.clearSession();
      await this.forceClearSession();

      const storage = this.getStorage();
      if (!storage) {
        return true;
      }

      const sessionRelatedKeys = Object.keys(storage).filter(
        (key) =>
          key.includes("token") ||
          key.includes("session") ||
          key.includes("user") ||
          key.includes("auth") ||
          key.includes("subscription") ||
          key.includes("redux") ||
          key.includes("persist")
      );

      sessionRelatedKeys.forEach((key) => storage.removeItem(key));
      return true;
    } catch {
      return false;
    }
  }

  async forceClearSession(): Promise<boolean> {
    try {
      const storage = this.getStorage();
      if (!storage) {
        return true;
      }

      storage.removeItem(SessionManager.ACCESS_TOKEN_KEY);
      storage.removeItem(SessionManager.USER_DATA_KEY);
      storage.removeItem(SessionManager.SUBSCRIPTION_DATA_KEY);

      const sessionKeys = Object.keys(storage).filter(
        (key) =>
          key.includes("token") ||
          key.includes("session") ||
          key.includes("user") ||
          key.includes("auth") ||
          key.includes("subscription") ||
          key.includes("redux")
      );

      sessionKeys.forEach((key) => storage.removeItem(key));
      return true;
    } catch {
      return false;
    }
  }

  async resetAllData(): Promise<boolean> {
    try {
      const storage = this.getStorage();
      if (!storage) {
        return true;
      }

      storage.clear();
      return true;
    } catch {
      return false;
    }
  }

  async isSessionValid(): Promise<boolean> {
    try {
      const token = await this.getAccessToken();
      const userData = await this.getUserData();

      if (!token || !userData) return false;
      if (token.trim() === "") return false;

      return true;
    } catch {
      return false;
    }
  }

  async checkForStaleData(): Promise<string[]> {
    try {
      const storage = this.getStorage();
      if (!storage) {
        return [];
      }

      return Object.keys(storage).filter(
        (key) =>
          key.includes("token") ||
          key.includes("session") ||
          key.includes("user") ||
          key.includes("auth") ||
          key.includes("subscription") ||
          key.includes("redux")
      );
    } catch {
      return [];
    }
  }

  async debugSession(): Promise<{
    hasToken: boolean;
    hasUserData: boolean;
    hasSubscriptionData: boolean;
  } | null> {
    try {
      const token = await this.getAccessToken();
      const userData = await this.getUserData();
      const subscriptionData = await this.getSubscriptionData();

      return {
        hasToken: !!token,
        hasUserData: !!userData,
        hasSubscriptionData: subscriptionData != null,
      };
    } catch {
      return null;
    }
  }
}

export default SessionManager;
