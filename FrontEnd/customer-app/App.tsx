import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { store, persistor } from "./src/redux/store";
import AppNavigator from "./src/navigation/AppNavigator";
import FontProvider from "./src/providers/FontProvider";

SplashScreen.preventAutoHideAsync(); // Giữ splash screen đến khi app sẵn sàng

export default function App() {
  useEffect(() => {
    if (__DEV__) {
      const defaultHandler = ErrorUtils.getGlobalHandler?.();
      ErrorUtils.setGlobalHandler?.((error, isFatal) => {
        console.error(error);
        if (defaultHandler) {
          defaultHandler(error, isFatal);
        }
      });
    }

    // Ẩn splash khi load xong
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 800); // bạn có thể chỉnh thời gian hoặc gắn vào logic load font/api

    return () => clearTimeout(timer);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <FontProvider>
            <AppNavigator />
          </FontProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
