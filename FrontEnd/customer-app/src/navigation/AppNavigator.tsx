// AppNavigator.tsx
import React, { useEffect, useState, useRef } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar, StyleSheet, View, Platform, Text } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import * as SystemUI from "expo-system-ui";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { setCredentials, logout } from "../redux/userSlice";
import { getToken, decodeJWT } from "../api/axiosClient";

// Screens
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import NotificationScreen from "../screens/Notification/NotificationScreen";
import NotificationDetailScreen from "../screens/Notification/NotificationDetailScreen";
import BranchDetailScreen from "../screens/Branch/BranchDetailScreen";
import GamesScreen from "../screens/Branch/GamesScreen";
import WalletScreen from "../screens/Wallet/WalletScreen";
import ContactScreen from "../screens/Contact/ContactScreen";
import TopUpConfirmScreen from "../screens/TopUp/TopUpConfirmScreen";
import { RootStackParamList } from "./types";
import AppHeader from "./AppHeader";
import TicketListScreen from "../screens/Ticket/TicketListScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";

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
    <Stack.Navigator
      screenOptions={{
        header: (props) => (Platform.OS === "web" ? <AppHeader {...props} /> : undefined),
      }}
    >
      <Stack.Screen name="MainApp" component={BottomTabNavigator} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
      <Stack.Screen name="BranchDetail" component={BranchDetailScreen} />
      <Stack.Screen name="GameDetail" component={GamesScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="TopUp" component={TopUpConfirmScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
      <Stack.Screen name="TicketList" component={TicketListScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
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

  useEffect(() => {
    if (Platform.OS !== "web") {
      SystemUI.setBackgroundColorAsync("#FFFFFF");
    }
  }, []);

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

  const doLogout = () => {
    dispatch(logout()); // ✅ Dùng action logout đã xoá cả Redux & localStorage
    clearTimers();
    setIsValid(false);
  };

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = window.setTimeout(() => {
      doLogout();
    }, INACTIVITY_MINUTES * 60 * 1000);
  };

  useEffect(() => {
    let mounted = true;

    const checkToken = async () => {
      setChecking(true);

      let token = reduxToken ?? (await getToken());

      if (!token) {               
        if (mounted) {          
          setIsValid(false);
          setChecking(false);
          return;
        }         
      }

      const payload = decodeJWT(token!);       

      const expSec = payload?.exp ?? null;
      
      if (!expSec) {        
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
        doLogout();
        if (mounted) {
          setIsValid(false);
          setChecking(false);
        }
        return;
      }

      // After all checks passed
      if (mounted) {        
        dispatch(setCredentials({ token, userInfo: payload ?? null }));     
        setIsValid(true);
        setChecking(false);
      } 

      const msUntilExpiry = expMs - now;
      if (expiryTimerRef.current) clearTimeout(expiryTimerRef.current);
      expiryTimerRef.current = setTimeout(() => {
        doLogout();
      }, msUntilExpiry) as any as number;

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

    checkToken();

    return () => {
      clearTimers();
      mounted = false;
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
