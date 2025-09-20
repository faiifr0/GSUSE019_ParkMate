// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import userReducer from './userSlice';

// Cấu hình persist (chọn storage để lưu Redux state)
const persistConfig = {
  key: 'root',
  storage: AsyncStorage as any, // với web bạn có thể thay bằng localStorage
};

// Gom các reducer lại (sau này nếu có nhiều slice khác thì thêm vào đây)
const rootReducer = combineReducers({
  user: userReducer,
});

// Bọc reducer bằng persistReducer để nó tự động lưu state
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Tạo Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/FLUSH',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
});

// Tạo persistor để dùng trong <PersistGate />
export const persistor = persistStore(store);

// Type helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
