import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/redux/store";
import AppNavigator from "./src/navigation/AppNavigator";
import FontProvider from "./src/providers/FontProvider";

export default function App() {
  useEffect(() => {
    if (__DEV__) {
      const defaultHandler = ErrorUtils.getGlobalHandler();
      ErrorUtils.setGlobalHandler((error, isFatal) => {
        console.error(error);
        if (defaultHandler) {
          defaultHandler(error, isFatal);
        }
      });
    }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <FontProvider>
          <AppNavigator />
        </FontProvider>
      </PersistGate>
    </Provider>
  );
}
