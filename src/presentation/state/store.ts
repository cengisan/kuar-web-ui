import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  type PersistConfig,
} from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import userReducer, { clearSession } from "./userSlice";
import apiStatusReducer from "./apiStatusSlice";
import { setupInterceptors } from "@/config/apiConfig";
import type { UserState } from "@/types";

const createNoopStorage = () => ({
  getItem(_key: string) {
    return Promise.resolve(null);
  },
  setItem(_key: string, value: unknown) {
    return Promise.resolve(value);
  },
  removeItem(_key: string) {
    return Promise.resolve();
  },
});

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const userPersistConfig: PersistConfig<UserState> = {
  key: "user",
  version: 1,
  storage,
  blacklist: ["translations"],
  migrate: (state) => {
    if (state && typeof state === "object" && "translations" in state) {
      const nextState = { ...state };
      delete (nextState as Record<string, unknown>).translations;
      return Promise.resolve(nextState);
    }
    return Promise.resolve(state);
  },
};

const persistConfig = {
  key: "root",
  storage,
  whitelist: [] as string[],
  blacklist: ["apiStatus"],
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  apiStatus: apiStatusReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);

setupInterceptors(store, clearSession);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
