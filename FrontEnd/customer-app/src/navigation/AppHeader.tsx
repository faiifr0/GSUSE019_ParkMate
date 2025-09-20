import React, { useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
// import { useSelector } from "react-redux";
// import { RootState } from "../redux/store";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type Props = { coin?: number };

export default function AppHeader({ coin = 0 }: Props) {
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const isMobileView = width < 768;
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ Lấy token từ redux để check login (giữ lại nhưng comment vì AppNavigator đã chặn)
  // const { token } = useSelector((state: RootState) => state.user);
  // const isLoggedIn = !!token;

  // 👉 Mobile header
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
        <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.primary }}>
          🎡 ParkMate
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* Trước đây check login ở đây, giờ bỏ luôn */}
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 20,
              marginRight: 12,
              borderWidth: 1.5,
              borderColor: colors.primary,
            }}
          >
            <Text style={{ fontWeight: "bold", color: colors.primary }}>
              🪙 {coin}
            </Text>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
            <Ionicons name="notifications-outline" size={26} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 👉 Web header
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 32,
        paddingVertical: 12,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        height: 64,
      }}
    >
      {/* Logo */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={require("../../assets/icon.png")}
          style={{ width: 80, height: 80, resizeMode: "contain", marginRight: 8 }}
        />
        <Text style={{ fontSize: 24, fontWeight: "700" }}>
          <Text style={{ color: colors.primary }}>PARK </Text>
          <Text style={{ color: colors.secondary }}>MATE</Text>
        </Text>
      </View>

      {/* Menu */}
      {!isMobileView ? (
        <View style={{ flexDirection: "row", gap: 32, alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>Trang chủ</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Contact")}>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>Liên hệ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("TicketList")}
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
              ĐẶT VÉ NGAY
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
          <Ionicons name="menu" size={28} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}
