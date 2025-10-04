// redux/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import userReducer from "./userSlice";
import aiChatReducer from "./aiChatSlice"; // ✅ thêm AI chat slice
import branchReducer from "./branchSlice";
import ticketReducer from "./ticketSlice";

// Chọn storage khác nhau cho web và mobile
let storage: any;
if (typeof window !== "undefined" && window.localStorage) {
  // Web
  const createWebStorage = require("redux-persist/lib/storage").default;
  storage = createWebStorage;
} else {
  // Mobile
  const AsyncStorage = require("@react-native-async-storage/async-storage").default;
  storage = AsyncStorage;
}

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  user: userReducer,
  aiChat: aiChatReducer, // ✅ thêm AI chat slice
      branch: branchReducer,
    ticket: ticketReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
