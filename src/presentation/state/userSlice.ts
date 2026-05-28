import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { languages } from "@/config/languages";
import SessionManager from "@/utils/SessionManager";
import SubscriptionRepositoryImpl from "@/data/repositories/SubscriptionRepositoryImpl";
import AuthRepositoryImpl from "@/data/repositories/AuthRepositoryImpl";
import type {
  EmployeeSessionData,
  LanguageCode,
  SubscriptionData,
  SubscriptionModule,
  UserState,
} from "@/types";

type UserDispatch = (action: unknown) => unknown;
type UserGetState = () => { user: UserState };

export const checkSubscriptionStatus = createAsyncThunk(
  "user/checkSubscriptionStatus",
  async (_, { getState }) => {
    const { accessToken, subscriberId, translations } = (getState() as { user: UserState }).user;
    if (!accessToken || !subscriberId) {
      return {
        active: false,
        data: null,
        subscribedModules: [] as SubscriptionModule[],
        subscriptionEndDate: null,
        trialStartDate: null,
        trialEndDate: null,
        trialDaysRemaining: 0,
      };
    }

    const repository = new SubscriptionRepositoryImpl(translations, accessToken);
    const sessionManager = SessionManager.getInstance();

    const fetchModuleSubscriptionData = async () => {
      const result = {
        subscribedModules: [] as SubscriptionModule[],
        subscriptionEndDate: null as string | null,
        trialStartDate: null as string | null,
        trialEndDate: null as string | null,
        trialDaysRemaining: 0,
      };

      try {
        const modulesResp = await repository.getSubscribedModules(subscriberId);
        if (modulesResp?.meta?.business_code === 0) {
          const payload = modulesResp.data;
          if (Array.isArray(payload)) {
            result.subscribedModules = payload;
          } else if (payload && typeof payload === "object") {
            const record = payload as Record<string, unknown>;
            result.subscribedModules = Array.isArray(record.modules)
              ? (record.modules as SubscriptionModule[])
              : Array.isArray(record.subscribed_modules)
                ? (record.subscribed_modules as SubscriptionModule[])
                : [];
            result.subscriptionEndDate =
              (record.subscription_end_date as string) ||
              (record.end_date as string) ||
              null;
          }
        }
      } catch {
        /* ignore */
      }

      try {
        const trialResp = await repository.getTrialStatus(subscriberId);
        if (trialResp?.meta?.business_code === 0 && trialResp.data) {
          const t = trialResp.data as Record<string, unknown>;
          result.trialStartDate =
            (t.trial_start_date as string) || (t.start_date as string) || null;
          result.trialEndDate =
            (t.trial_end_date as string) || (t.end_date as string) || null;
          result.trialDaysRemaining =
            typeof t.days_remaining === "number"
              ? t.days_remaining
              : typeof t.trial_days_remaining === "number"
                ? t.trial_days_remaining
                : 0;
        }
      } catch {
        /* ignore */
      }

      return result;
    };

    const moduleData = await fetchModuleSubscriptionData();
    const hasActiveModules = moduleData.subscribedModules.length > 0;

    if (hasActiveModules) {
      await sessionManager.setSubscriptionData({ status: "ACTIVE" });
      return {
        active: true,
        data: null,
        ...moduleData,
      };
    }

    await sessionManager.setSubscriptionData(null);
    return {
      active: false,
      data: null,
      ...moduleData,
    };
  }
);

const initialState: UserState = {
  email: "",
  password: "",
  name: "",
  msisdn: "",
  language: "tr",
  translations: languages.tr,
  isAuthenticated: false,
  accessToken: null,
  subscriberId: null,
  theme: "dark",
  currency: "TRY",
  hasActiveSubscription: true,
  subscriptionData: null,
  is_trial_enable: false,
  subscribedModules: [],
  subscriptionEndDate: null,
  trialStartDate: null,
  trialEndDate: null,
  trialDaysRemaining: 0,
  unreadFeedbackCount: 0,
  isCheckingSubscription: false,
  is_first_login: false,
  isEmployee: false,
  employeeData: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setMsisdn: (state, action: PayloadAction<string>) => {
      state.msisdn = action.payload;
    },
    setLanguage: (state, action: PayloadAction<LanguageCode>) => {
      state.language = action.payload;
      state.translations = languages[action.payload];
    },
    setTheme: (state, action: PayloadAction<"dark" | "light">) => {
      state.theme = action.payload;
      SessionManager.getInstance().setTheme(action.payload);
    },
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },
    setSubscriberId: (state, action: PayloadAction<number>) => {
      state.subscriberId = action.payload;
    },
    setSubscriptionData: (state, action: PayloadAction<SubscriptionData | null>) => {
      state.subscriptionData = action.payload;
      state.hasActiveSubscription = !!(
        action.payload && action.payload.status === "ACTIVE"
      );
    },
    setEmployeeSession: (state, action: PayloadAction<EmployeeSessionData>) => {
      state.isEmployee = true;
      state.employeeData = action.payload;
    },
    setSubscribedModules: (state, action: PayloadAction<SubscriptionModule[]>) => {
      state.subscribedModules = Array.isArray(action.payload) ? action.payload : [];
    },
    setSubscriptionEndDate: (state, action: PayloadAction<string | null>) => {
      state.subscriptionEndDate = action.payload || null;
    },
    setTrialStartDate: (state, action: PayloadAction<string | null>) => {
      state.trialStartDate = action.payload || null;
    },
    clearSession: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
      state.email = "";
      state.password = "";
      state.name = "";
      state.msisdn = "";
      state.subscriberId = null;
      state.hasActiveSubscription = false;
      state.subscriptionData = null;
      state.is_trial_enable = false;
      state.unreadFeedbackCount = 0;
      state.is_first_login = false;
      state.isCheckingSubscription = false;
      state.isEmployee = false;
      state.employeeData = null;
      state.subscribedModules = [];
      state.subscriptionEndDate = null;
      state.trialStartDate = null;
      state.trialEndDate = null;
      state.trialDaysRemaining = 0;
      state.translations = languages[state.language || "tr"];
      state.currency = "TRY";
    },
    setIsTrialEnable: (state, action: PayloadAction<boolean>) => {
      state.is_trial_enable = action.payload;
    },
    setUnreadFeedbackCount: (state, action: PayloadAction<number>) => {
      state.unreadFeedbackCount = action.payload;
    },
    incrementUnreadFeedbackCount: (state) => {
      state.unreadFeedbackCount += 1;
    },
    decrementUnreadFeedbackCount: (state) => {
      if (state.unreadFeedbackCount > 0) {
        state.unreadFeedbackCount -= 1;
      }
    },
    resetUnreadFeedbackCount: (state) => {
      state.unreadFeedbackCount = 0;
    },
    setIsCheckingSubscription: (state, action: PayloadAction<boolean>) => {
      state.isCheckingSubscription = action.payload;
    },
    setIsFirstLogin: (state, action: PayloadAction<boolean>) => {
      state.is_first_login = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkSubscriptionStatus.fulfilled, (state, action) => {
        state.subscriptionData = action.payload.data;
        state.hasActiveSubscription = action.payload.active;
        state.subscribedModules = Array.isArray(action.payload.subscribedModules)
          ? action.payload.subscribedModules
          : [];
        state.subscriptionEndDate = action.payload.subscriptionEndDate ?? null;
        state.trialStartDate = action.payload.trialStartDate ?? null;
        state.trialEndDate = action.payload.trialEndDate ?? null;
        state.trialDaysRemaining =
          typeof action.payload.trialDaysRemaining === "number"
            ? action.payload.trialDaysRemaining
            : 0;
      })
      .addCase("persist/REHYDRATE", (state, action) => {
        const payload = (action as { payload?: { user?: { language?: LanguageCode } } }).payload;
        if (payload?.user?.language) {
          state.translations = languages[payload.user.language];
        }
      });
  },
});

export const {
  setEmail,
  setPassword,
  setName,
  setMsisdn,
  setLanguage,
  setToken,
  setEmployeeSession,
  clearSession,
  setTheme,
  setSubscriberId,
  setCurrency,
  setSubscriptionData,
  setIsTrialEnable,
  setUnreadFeedbackCount,
  incrementUnreadFeedbackCount,
  decrementUnreadFeedbackCount,
  resetUnreadFeedbackCount,
  setIsCheckingSubscription,
  setIsFirstLogin,
  setSubscribedModules,
  setSubscriptionEndDate,
  setTrialStartDate,
} = userSlice.actions;

export const initializeSession =
  () => async (dispatch: UserDispatch, getState: UserGetState) => {
    const sessionManager = SessionManager.getInstance();

    try {
      const currentState = getState().user;

      if (currentState.isAuthenticated && currentState.accessToken) {
        const token = await sessionManager.getAccessToken();
        const userData = await sessionManager.getUserData();

        if (token && userData) {
          const sessionSubscriberId =
            (userData.subscriber_id as number | undefined) ||
            (userData.subscriberId as number | undefined);

          if (
            currentState.subscriberId &&
            sessionSubscriberId &&
            currentState.subscriberId !== sessionSubscriberId
          ) {
            await sessionManager.clearSession();
            dispatch(clearSession());
            return;
          }

          if (currentState.subscriberId) {
            await dispatch(checkSubscriptionStatus());
          }
          return;
        }

        if (currentState.accessToken && currentState.subscriberId) {
          await sessionManager.setToken(currentState.accessToken);
          await sessionManager.setUserData({
            subscriber_id: currentState.subscriberId,
            name: currentState.name,
            theme: currentState.theme,
          });
          await dispatch(checkSubscriptionStatus());
          return;
        }

        await sessionManager.clearSession();
        dispatch(clearSession());
        return;
      }

      const token = await sessionManager.getAccessToken();
      if (!token) {
        await sessionManager.setSubscriptionData(null);
        await sessionManager.clearSession();
        dispatch(clearSession());
        return;
      }

      const userData = await sessionManager.getUserData();

      if (token && userData) {
        dispatch(setToken(token));
        dispatch(setName((userData.name as string) || ""));

        if (
          userData.theme === "dark" ||
          userData.theme === "light"
        ) {
          dispatch(setTheme(userData.theme));
        }

        if (userData.isEmployee) {
          dispatch(
            setEmployeeSession({
              employeeId: userData.employeeId as number,
              name: userData.name as string,
              role: userData.role as string | undefined,
              permissions: userData.permissions as string[] | undefined,
              businessId: userData.businessId as number | undefined,
              businessName: userData.businessName as string | undefined,
              employerId: userData.employerId as number | undefined,
              employerName: userData.employerName as string | undefined,
            })
          );
          return;
        }

        const subscriberId =
          (userData.subscriber_id as number | undefined) ||
          (userData.subscriberId as number | undefined);
        if (subscriberId) {
          dispatch(setSubscriberId(subscriberId));
          await dispatch(checkSubscriptionStatus());
        } else {
          await sessionManager.setSubscriptionData(null);
          dispatch(setSubscriptionData(null));
        }

        if (userData.is_trial_enable !== undefined) {
          dispatch(setIsTrialEnable(Boolean(userData.is_trial_enable)));
        }
      } else {
        await sessionManager.clearSession();
        dispatch(clearSession());
      }
    } catch {
      await sessionManager.clearSession();
      dispatch(clearSession());
    }
  };

export const startSession =
  (token: string, userData?: Record<string, unknown>) =>
  async (dispatch: UserDispatch) => {
    const sessionManager = SessionManager.getInstance();

    try {
      await sessionManager.setSubscriptionData(null);
      dispatch(setSubscriptionData(null));

      const tokenSuccess = await sessionManager.setToken(token);
      const userDataSuccess = userData
        ? await sessionManager.setUserData(userData)
        : true;

      if (tokenSuccess && userDataSuccess) {
        dispatch(setToken(token));

        if (userData) {
          if (userData.subscriber_id) {
            dispatch(setSubscriberId(userData.subscriber_id as number));
          }
          if (userData.subscriberId) {
            dispatch(setSubscriberId(userData.subscriberId as number));
          }
          if (userData.is_trial_enable !== undefined) {
            dispatch(setIsTrialEnable(Boolean(userData.is_trial_enable)));
          }
        }
      } else {
        await sessionManager.clearSession();
        dispatch(clearSession());
        throw new Error("Failed to initialize session");
      }
    } catch (error) {
      await sessionManager.clearSession();
      dispatch(clearSession());
      throw error;
    }
  };

export const startEmployeeSession =
  (token: string, employeeData: EmployeeSessionData) =>
  async (dispatch: UserDispatch) => {
    const sessionManager = SessionManager.getInstance();

    try {
      const tokenSuccess = await sessionManager.setToken(token);
      const userDataSuccess = await sessionManager.setUserData({
        isEmployee: true,
        ...employeeData,
      });

      if (tokenSuccess && userDataSuccess) {
        dispatch(setEmployeeSession(employeeData));
        dispatch(setToken(token));
      } else {
        await sessionManager.clearSession();
        dispatch(clearSession());
        throw new Error("Failed to initialize employee session");
      }
    } catch (error) {
      await sessionManager.clearSession();
      dispatch(clearSession());
      throw error;
    }
  };

export const endSession =
  () => async (dispatch: UserDispatch, getState: UserGetState) => {
    const state = getState();
    const accessToken = state.user.accessToken;
    const translations = state.user.translations;

    dispatch(clearSession());

    const sessionManager = SessionManager.getInstance();
    await sessionManager.clearSession();
    await sessionManager.setSubscriptionData(null);

    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem("persist:user");
        window.localStorage.removeItem("persist:root");
      } catch {
        /* ignore */
      }
    }

    if (accessToken) {
      const authRepository = new AuthRepositoryImpl(translations);
      try {
        await authRepository.logout(accessToken);
      } catch {
        /* ignore */
      }
    }
  };

export default userSlice.reducer;
