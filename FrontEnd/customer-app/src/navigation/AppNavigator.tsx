// AppNavigator.tsx
import React, { useEffect, useState, useRef } from "react";
import { NavigationContainer, DefaultTheme, NavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar, StyleSheet, View, Platform, Text } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import * as SystemUI from "expo-system-ui";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { setCredentials, logout } from "../redux/userSlice";
import { getToken, decodeJWT } from "../api/axiosClient";
import * as Linking from "expo-linking";

// Screens
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import NotificationScreen from "../screens/Notification/NotificationScreen";
import NotificationDetailScreen from "../screens/Notification/NotificationDetailScreen";
import BranchDetailScreen from "../screens/Branch/BranchDetailScreen";
import WalletScreen from "../screens/Wallet/WalletScreen";
import ContactScreen from "../screens/Contact/ContactScreen";
import TopUpConfirmScreen from "../screens/TopUp/TopUpConfirmScreen";
import { RootStackParamList } from "./types";
import AppHeader from "./AppHeader";
import TicketListScreen from "../screens/Ticket/TicketListScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import WalletTopupSuccessScreen from "../screens/Wallet/WalletTopupSuccessScreen";
import WalletTopupCancelScreen from "../screens/Wallet/WalletTopupCancelScreen";
import OrderConfirmScreen from "../screens/Order/OrderConfirmScreen";
import OrderDetailScreen from "../screens/Order/OrderDetailScreen";
import OrderListScreen from "../screens/Order/OrderListScreen";
import GameDetailScreen from "../screens/Game/GameDetailScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EventScreen from "../screens/Event/EventScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();
export const navigationRef = React.createRef<NavigationContainerRef<any>>();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function MainAppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => (Platform.OS === "web" ? <AppHeader {...props} /> : undefined),
      }}
    >
      <Stack.Screen name="MainApp" component={BottomTabNavigator} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
      <Stack.Screen name="BranchDetail" component={BranchDetailScreen} />
      <Stack.Screen name="GameDetail" component={GameDetailScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="TopUp" component={TopUpConfirmScreen} />
      <Stack.Screen name="EventDetail" component={EventScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
      <Stack.Screen name="TicketList" component={TicketListScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="WalletTopupSuccessScreen" component={WalletTopupSuccessScreen} />
      <Stack.Screen name="WalletTopupCancelScreen" component={WalletTopupCancelScreen} />
      <Stack.Screen name="OrderConfirm" component={OrderConfirmScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <Stack.Screen name="OrderList" component={OrderListScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigatorInnerBase() {
  const insets = useSafeAreaInsets();
  const reduxToken = useSelector((state: RootState) => state.user.token);
  const dispatch = useDispatch();

  const [checking, setChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  const expiryTimerRef = useRef<number | null>(null);
  const inactivityTimerRef = useRef<number | null>(null);
  const INACTIVITY_MINUTES = 30;

  const clearTimers = () => {
    if (expiryTimerRef.current) {
      clearTimeout(expiryTimerRef.current);
      expiryTimerRef.current = null;
    }
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  };

  const doLogout = async () => {
    try {
      clearTimers();

      // 1️⃣ Xóa Redux persist
      dispatch(logout());

      // 2️⃣ Xóa token ở AsyncStorage / localStorage
      if (Platform.OS === "web") {
        localStorage.removeItem("token");
      } else {
        await AsyncStorage.removeItem("token");
      }


      setIsValid(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = window.setTimeout(() => {
      doLogout();
    }, INACTIVITY_MINUTES * 60 * 1000);
  };

  useEffect(() => {
    if (Platform.OS !== "web") {
      SystemUI.setBackgroundColorAsync("#FFFFFF");
    }
  }, []);

  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const data = Linking.parse(event.url);
      if (data.path === "wallet/success") {
        navigationRef.current?.navigate("WalletTopupSuccessScreen");
      } else if (data.path === "wallet/cancel") {
        navigationRef.current?.navigate("WalletTopupCancelScreen");
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    let active = true;

    const verifyToken = async () => {
      setChecking(true);
      const token = reduxToken ?? (await getToken());

      if (!token) {
        if (active) doLogout();
        setChecking(false);
        return;
      }

      const payload = decodeJWT(token);
      if (!payload?.userId) {
        if (active) doLogout();
        setChecking(false);
        return;
      }

      const now = Date.now();
      const expMs = payload.exp ? payload.exp * 1000 : null;

      if (expMs && expMs <= now) {
        if (active) doLogout();
        setChecking(false);
        return;
      }

      if (active) {
        dispatch(setCredentials({ token, userInfoCustomer: payload }));
        setIsValid(true);
        setChecking(false);
      }

      if (expMs) {
        if (expiryTimerRef.current) clearTimeout(expiryTimerRef.current);
        expiryTimerRef.current = setTimeout(() => {
          doLogout();
        }, expMs - now) as any as number;
      }

      if (Platform.OS === "web") {
        resetInactivityTimer();
        const events = ["mousemove", "mousedown", "keydown", "touchstart"];
        const handler = () => resetInactivityTimer();
        events.forEach((ev) => window.addEventListener(ev, handler));
        return () => {
          events.forEach((ev) => window.removeEventListener(ev, handler));
          clearTimers();
        };
      }
    };

    verifyToken();

    return () => {
      active = false;
      clearTimers();
    };
  }, [reduxToken, dispatch]);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Đang kiểm tra phiên đăng nhập...</Text>
      </View>
    );
  }

  const linking = {
    prefixes: ["parkmate://", "/"],
    config: {
      screens: {
        Login: "login",
        Register: "register",
        MainApp: {
          path: "app",
          screens: {
            Home: "home",
            TicketList: "tickets",
            QRCodeScanner: "scan",
            Profile: "profile",
            BranchDetail: "branch/:id",
            Promotion: "promotion",
            ChatBox: "chat",
            Contact: "contact",
          },
        },
        Notifications: "notifications",
        NotificationDetail: "notification/:id",
        Wallet: "wallet",
        TopUp: "topup",
        WalletTopupSuccessScreen: "wallet/success",
        WalletTopupCancelScreen: "wallet/cancel",
      },
    },
    getInitialURL: async () => {
      const url = Platform.OS === "web" ? window.location.pathname : "";
      if (!isValid && typeof url === "string" && url.startsWith("/app")) {
        return "/login";
      }
      return url;
    },
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
      <NavigationContainer ref={navigationRef} theme={LightTheme} linking={linking}>
        {isValid ? <MainAppStack /> : <AuthStack />}
      </NavigationContainer>
    </View>
  );
}

export function AppNavigator() {
  return (
    <SafeAreaProvider>
      <AppNavigatorInnerBase />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
});

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent",
    text: "#000",
  },
};
