import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/Home/HomeScreen";
import TicketListScreen from "../screens/Ticket/TicketListScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import QRCodeScannerScreen from "../screens/QRCode/QRCodeScannerScreen";

// Bổ sung các trang cho web stack
import BranchDetailScreen from "../screens/Branch/BranchDetailScreen";
import PromotionScreen from "../screens/Promotion/PromotionScreen";
import ChatBoxScreen from "../screens/ChatBox/ChatBox";
import ContactScreen from "../screens/Contact/ContactScreen";

import type { RootStackParamList, BottomTabParamList } from "./types";

const Tab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// 👉 Web Navigator (stack)
function WebNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="TicketList" component={TicketListScreen} />
      <Stack.Screen name="QRCodeScanner" component={QRCodeScannerScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="BranchDetail" component={BranchDetailScreen} />
      <Stack.Screen name="Promotion" component={PromotionScreen} />
      <Stack.Screen name="ChatBox" component={ChatBoxScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
    </Stack.Navigator>
  );
}

// 👉 Mobile Navigator (tab)
export default function BottomTabNavigator() {
  if (Platform.OS === "web") return <WebNavigator />;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#FF6B00",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          height: 65,
          paddingBottom: 8,
          paddingTop: 6,
          position: "absolute",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 4,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600", marginBottom: 4 },
        tabBarIcon: ({ color }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";
          if (route.name === "Home") iconName = "home";
          else if (route.name === "TicketList") iconName = "ticket";
          else if (route.name === "QRCodeScanner") iconName = "qr-code";
          else if (route.name === "Profile") iconName = "person";
          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Trang chủ" }} />
      <Tab.Screen name="TicketList" component={TicketListScreen} options={{ title: "Vé" }} />
      <Tab.Screen name="QRCodeScanner" component={QRCodeScannerScreen} options={{ title: "Quét QR" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Tài khoản" }} />
    </Tab.Navigator>
  );
}
