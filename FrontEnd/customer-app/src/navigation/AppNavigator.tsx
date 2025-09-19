import React, { useEffect } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import * as SystemUI from "expo-system-ui";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import NotificationScreen from "../screens/Notification/NotificationScreen";
import NotificationDetailScreen from "../screens/Notification/NotificationDetailScreen";
import BranchDetailScreen from "../screens/Branch/BranchDetailScreen";
import GamesScreen from "../screens/Branch/GamesScreen";
import WalletScreen from "../screens/Wallet/WalletScreen";
import TopUpConfirmScreen from "../screens/TopUp/TopUpConfirmScreen";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

// Auth stack
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// Main app stack
function MainAppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainApp" component={BottomTabNavigator} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
      <Stack.Screen name="BranchDetail" component={BranchDetailScreen} />
      <Stack.Screen name="GameDetail" component={GamesScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="TopUp" component={TopUpConfirmScreen} />
    </Stack.Navigator>
  );
}

function AppNavigatorInner() {
  const insets = useSafeAreaInsets();
  const { token } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync("#FFFFFF");
  }, []);

  const isLoggedIn = !!token;

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
      <NavigationContainer theme={LightTheme}>
        {isLoggedIn ? <MainAppStack /> : <AuthStack />}
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
  safeArea: { flex: 1, backgroundColor: "#fff" },
});

const LightTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: "#fff", text: "#000" },
};
