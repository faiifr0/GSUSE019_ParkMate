// src/navigation/AppHeader.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import { persistor, RootState } from "../redux/store";
import { useWallet } from "../hooks/useWallet";

export default function AppHeader(props: NativeStackHeaderProps) {
  const { navigation } = props;
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const isMobileView = width < 768;
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user.userInfo);

  // Hook lấy số dư ví
  const { balance: coin, refreshWallet } = useWallet();

  useEffect(() => {
    if (user?.id) refreshWallet();
  }, [user]);

  // ---------------- MOBILE HEADER ----------------
  if (!isWeb) {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: "transparent",
        }}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("MainApp", { screen: "Home" })
          }
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.primary }}>
            🎡 ParkMate
          </Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 20,
              marginRight: 12,
              borderWidth: 1.5,
              borderColor: colors.primary,
              backgroundColor: "rgba(255,255,255,0.2)",
            }}
          >
            <Text style={{ fontWeight: "bold", color: colors.primary }}>🪙 {coin}</Text>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
            <Ionicons name="notifications-outline" size={26} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ---------------- WEB HEADER ----------------
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 32,
        paddingVertical: 12,
        backgroundColor: "transparent",
        height: 64,
        position: "relative",
      }}
    >
      {/* Logo */}
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center" }}
        onPress={() =>
          navigation.navigate("MainApp", { screen: "Home" })
        }
      >
        <Image
          source={require("../../assets/icon.png")}
          style={{ width: 80, height: 80, resizeMode: "contain", marginRight: 8 }}
        />
        <Text style={{ fontSize: 24, fontWeight: "700" }}>
          <Text style={{ color: colors.primary }}>PARK </Text>
          <Text style={{ color: colors.secondary }}>MATE</Text>
        </Text>
      </TouchableOpacity>

      {/* Menu + coin + user */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 24 }}>
        {!isMobileView && (
          <>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("MainApp", { screen: "Home" })
              }
            >
              <Text style={{ fontSize: 16, fontWeight: "500" }}>Trang chủ</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Contact")}>
              <Text style={{ fontSize: 16, fontWeight: "500" }}>Liên hệ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("OrderList")}
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
                VÉ CỦA BẠN
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* Coin */}
        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            borderWidth: 1.5,
            borderColor: colors.primary,
            backgroundColor: "rgba(255,255,255,0.2)",
          }}
        >
          <Text style={{ fontWeight: "bold", color: colors.primary }}>🪙 {coin}</Text>
        </View>

        {/* Notifications */}
        <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
          <Ionicons name="notifications-outline" size={26} color={colors.primary} />
        </TouchableOpacity>

        {/* User avatar + dropdown */}
        <View style={{ position: "relative" }}>
          <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
            <Ionicons name="person-circle-outline" size={28} color={colors.primary} />
          </TouchableOpacity>

          {menuOpen && (
            <View
              style={{
                position: "absolute",
                top: 36,
                right: 0,
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                paddingVertical: 8,
                width: 150,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 5,
                zIndex: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setMenuOpen(false);
                  navigation.navigate("Profile");
                }}
                style={{ paddingVertical: 8, paddingHorizontal: 12 }}
              >
                <Text>Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  setMenuOpen(false);
                  dispatch(logout());
                  await persistor.flush();
                }}
                style={{ paddingVertical: 8, paddingHorizontal: 12 }}
              >
                <Text>Logout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
