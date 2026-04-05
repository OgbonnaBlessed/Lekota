// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/base.api";
import authReducer from "./slices/auth.slice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// -----------------------
// Persist config
// -----------------------
const persistConfig = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// -----------------------
// Configure store
// -----------------------
export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
});

// -----------------------
// Persistor
// -----------------------
export const persistor = persistStore(store);

// -----------------------
// Types for hooks
// -----------------------
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;