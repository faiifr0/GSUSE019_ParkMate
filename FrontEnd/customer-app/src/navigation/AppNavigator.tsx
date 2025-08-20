import React, { useEffect } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import * as SystemUI from "expo-system-ui";

import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import NotificationScreen from "../screens/Notification/NotificationScreen";
import NotificationDetailScreen from "../screens/Notification/NotificationDetailScreen";

const Stack = createNativeStackNavigator();

function AppNavigatorInner() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Đặt navigation bar Android màu trắng, icon 3 nút đen
    SystemUI.setBackgroundColorAsync("#FFFFFF");
  }, []);

  return (
    <View
      style={[
        styles.safeArea,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {/* StatusBar trong suốt, chữ đen */}
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent
      />

      <NavigationContainer theme={LightTheme}>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Login"
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="MainApp" component={BottomTabNavigator} />

          {/* Stack cho thông báo */}
          <Stack.Screen name="Notifications" component={NotificationScreen} />
          <Stack.Screen
            name="NotificationDetail"
            component={NotificationDetailScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default function AppNavigator() {
  return (
    <SafeAreaProvider>
      <AppNavigatorInner />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff", // nền trắng để nội dung rõ ràng
  },
});

// Light theme với chữ đen, nền trắng
const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#fff",
    text: "#000",
  },
};
