// src/navigation/AppNavigator.tsx
import React, { useEffect, useState, useRef } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar, StyleSheet, View, Platform, Text } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import * as SystemUI from "expo-system-ui";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { setCredentials } from "../redux/userSlice";
import { getToken, decodeJWT } from "../api/axiosClient"; // sử dụng helper đã có

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

export default function AppNavigatorInnerBase() {
  const insets = useSafeAreaInsets();
  const reduxToken = useSelector((state: RootState) => state.user.token);
  const dispatch = useDispatch();

  const [checking, setChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  // refs để giữ timer id
  const expiryTimerRef = useRef<number | null>(null);
  const inactivityTimerRef = useRef<number | null>(null);

  // cấu hình inactivity (phút)
  const INACTIVITY_MINUTES = 30; // thay đổi nếu cần

  useEffect(() => {
    SystemUI.setBackgroundColorAsync("#FFFFFF");
  }, []);

  // Clear timers helper
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

  // Thực hiện logout: xóa storage + redux
  const doLogout = () => {
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("walletId");
      }
    } catch (e) {
      // ignore
    }
    dispatch(setCredentials({ token: null, userInfo: null }));
    clearTimers();
    setIsValid(false);
  };

  // reset inactivity timer (web)
  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = window.setTimeout(() => {
      // auto logout on inactivity
      doLogout();
    }, INACTIVITY_MINUTES * 60 * 1000);
  };

  // Kiểm tra token (từ storage hoặc redux)
  useEffect(() => {
    let mounted = true;

    const checkToken = async () => {
      setChecking(true);

      // 1) lấy token từ storage nếu redux chưa có
      let token = reduxToken ?? (await getToken()); // getToken trả về string|null

      if (!token) {
        if (mounted) {
          setIsValid(false);
          setChecking(false);
        }
        return;
      }

      // 2) decode JWT để đọc exp (nếu không phải JWT thì không có exp)
      const payload = decodeJWT(token);
      const expSec = payload?.exp ?? null;

      if (!expSec) {
        // Không có exp → không thể check expiry mà vẫn chấp nhận token (kém an toàn)
        // Ở đây chọn: chấp nhận token nhưng không đặt expiry timer. Nếu muốn, có thể đặt TTL mặc định.
        dispatch(setCredentials({ token, userInfo: payload ?? null }));
        if (mounted) {
          setIsValid(true);
          setChecking(false);
        }
        return;
      }

      const expMs = expSec * 1000;
      const now = Date.now();

      if (expMs <= now) {
        // hết hạn
        doLogout();
        if (mounted) {
          setIsValid(false);
          setChecking(false);
        }
        return;
      }

      // token hợp lệ → set redux nếu chưa set
      dispatch(setCredentials({ token, userInfo: payload ?? null }));
      if (mounted) {
        setIsValid(true);
        setChecking(false);
      }

      // set timer tự logout khi token hết hạn
      const msUntilExpiry = expMs - now;
      if (expiryTimerRef.current) clearTimeout(expiryTimerRef.current);
      expiryTimerRef.current = setTimeout(() => {
        doLogout();
      }, msUntilExpiry) as any as number;

      // nếu chạy web: gắn listener để reset inactivity
      if (Platform.OS === "web") {
        resetInactivityTimer();
        // events to consider activity
        const events = ["mousemove", "mousedown", "keydown", "touchstart"];
        const handler = () => resetInactivityTimer();
        events.forEach((ev) => window.addEventListener(ev, handler));
        // cleanup: remove listeners on unmount (handled below)
        return () => {
          events.forEach((ev) => window.removeEventListener(ev, handler));
          clearTimers();
        };
      }
    };

    const cleanupPromise = checkToken();

    return () => {
      // cleanup
      clearTimers();
      // if checkToken returned a cleanup (for web) handle it (but we can't await)
      // simple: just mark unmounted
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxToken, dispatch]);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Đang kiểm tra phiên đăng nhập...</Text>
      </View>
    );
  }

  // Linking config cho web (giữ nguyên)
  const linking = {
    prefixes: ["/"],
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
      },
    },
    getInitialURL: async () => {
      // if navigating directly to /app/* and not valid -> send to /login
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
      <NavigationContainer theme={LightTheme} linking={Platform.OS === "web" ? linking : undefined}>
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
  safeArea: { flex: 1, backgroundColor: "#fff" },
});

const LightTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: "#fff", text: "#000" },
};
