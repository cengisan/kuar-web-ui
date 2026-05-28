import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ApiErrorPayload, ApiStatusState, NetworkErrorEntry } from "@/types";

const initialState: ApiStatusState = {
  isLoading: false,
  lastApiStatus: null,
  lastApiError: null,
  networkErrors: [],
  isNetworkError: false,
  errorPopupVisible: false,
};

const apiStatusSlice = createSlice({
  name: "apiStatus",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setApiStatus: (state, action: PayloadAction<number>) => {
      state.lastApiStatus = action.payload;
    },
    setApiError: (state, action: PayloadAction<ApiErrorPayload>) => {
      state.lastApiError = action.payload;
      if (action.payload && action.payload.status >= 500) {
        state.isNetworkError = true;
        state.errorPopupVisible = true;
        state.networkErrors.push({
          status: action.payload.status,
          message: action.payload.message || "Network Error",
          timestamp: new Date().toISOString(),
          url: action.payload.url || "Unknown",
        });
      }
    },
    addNetworkError: (
      state,
      action: PayloadAction<Omit<NetworkErrorEntry, "timestamp">>
    ) => {
      state.networkErrors.push({
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
      state.isNetworkError = true;
      state.errorPopupVisible = true;
    },
    clearNetworkError: (state) => {
      state.isNetworkError = false;
      state.errorPopupVisible = false;
      state.lastApiError = null;
    },
    clearAllNetworkErrors: (state) => {
      state.networkErrors = [];
      state.isNetworkError = false;
      state.errorPopupVisible = false;
      state.lastApiError = null;
    },
    hideErrorPopup: (state) => {
      state.errorPopupVisible = false;
    },
    resetApiStatus: (state) => {
      state.lastApiStatus = null;
      state.lastApiError = null;
      state.isLoading = false;
    },
  },
});

export const {
  setLoading,
  setApiStatus,
  setApiError,
  addNetworkError,
  clearNetworkError,
  clearAllNetworkErrors,
  hideErrorPopup,
  resetApiStatus,
} = apiStatusSlice.actions;

export default apiStatusSlice.reducer;
