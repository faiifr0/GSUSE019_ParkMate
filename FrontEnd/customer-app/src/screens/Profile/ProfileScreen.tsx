// src/screens/Profile/ProfileScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { persistor, RootState } from "../../redux/store";
import { logout } from "../../redux/userSlice";
import { getUserById } from "../../services/userService";
import { Ionicons } from "@expo/vector-icons";
import { walletService } from "../../services/walletService";
import colors from "../../constants/colors";
import styles from "../../styles/ProfileScreenStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.userInfo);
  const [userData, setUserData] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {    
    if (user?.userId) {
      fetchUserInfo(user.userId);
      fetchWalletBalance(user.userId);
    }
  }, [user]);

  const fetchUserInfo = async (id: number) => {
    try {
      setLoading(true);
      const res = await getUserById(id);
      setUserData(res.data || null);
      console.log("Fetched user data:", res.data);
      console.log("----------------------");
    } catch (error) {
      console.error("Lỗi khi lấy thông tin user:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletBalance = async (userId: number) => {
    try {
      const wallet = await walletService.getWalletById(userId);
      setWalletBalance(wallet.balance || 0);
    } catch (error) {
      console.error("Lỗi khi lấy số dư ví:", error);
      setWalletBalance(0);
    }
  };

  const handleLogout = async () => {
    console.log("Logout button pressed");
    // ✅ Chỉ dispatch logout, AppNavigator sẽ tự render Login
    dispatch(logout());        
    persistor.purge();
    await AsyncStorage.removeItem("token"); // Clear JWT Token
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // ==========================
  // WEB GIAO DIỆN
  // ==========================
  if (Platform.OS === "web") {
    return (
      <ScrollView>
        <View
          style={{
            maxWidth: 800,
            marginHorizontal: "auto",
            padding: 24,
            alignItems: "center",
          }}
        >
          {/* Avatar + Info */}
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=12" }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              marginBottom: 16,
              borderWidth: 3,
              borderColor: "#fff",
            }}
          />
          <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 4, color: "#333" }}>
            {userData?.username || "Khách hàng"}
          </Text>
          <Text style={{ fontSize: 16, color: "#555" }}>
            {userData?.email || "Chưa có email"}
          </Text>
          <Text style={{ fontSize: 16, color: "#555", marginBottom: 24 }}>
            {userData?.phone || "Chưa có số điện thoại"}
          </Text>

          {/* Nút hành động */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 16,
              marginBottom: 32,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#FF6B6B",
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 12,
              }}
              onPress={() => navigation.navigate("TicketList")}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Lịch sử vé</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "#7B61FF",
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 12,
              }}
              onPress={() => navigation.navigate("ChangePassword")}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Đổi mật khẩu</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "#2EC4B6",
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 12,
              }}
              onPress={() => navigation.navigate("EditProfile")}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Cài đặt</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "#FF4D4D",
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 12,
              }}
              onPress={handleLogout}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>

          {/* Thông tin thêm */}
          <View style={{ width: "100%", gap: 12 }}>
            <Text style={{ fontSize: 16, color: "#333" }}>💰 Số dư ví: {walletBalance} coin</Text>
            <Text style={{ fontSize: 16, color: "#333" }}>
              🏢 Chi nhánh: {userData?.parkBranch?.name || "Chưa có"}
            </Text>
            <Text style={{ fontSize: 16, color: "#333" }}>
              🎭 Vai trò: {userData?.role?.name || "Khách"}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  // ==========================
  // APP GIAO DIỆN
  // ==========================
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          alignItems: "center",
          padding: 24,
          backgroundColor: colors.primary,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 12 }}
        />
        <Text style={{ fontSize: 22, fontWeight: "bold", color: "#fff" }}>
          {userData?.username || "Khách hàng"}
        </Text>
        <Text style={{ fontSize: 14, color: "#eee" }}>
          {userData?.email || "Chưa có email"}
        </Text>
      </View>

      {/* Card thông tin */}
      <View
        style={{
          margin: 16,
          padding: 16,
          borderRadius: 16,
          backgroundColor: colors.surface,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Text style={{ fontSize: 16, marginBottom: 8, color: colors.textPrimary }}>
          🏢 Chi nhánh: {userData?.parkBranch?.name || "Chưa có"}
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 8, color: colors.textPrimary }}>
          🎭 Vai trò: {userData?.role?.name || "Khách"}
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 8, color: colors.textPrimary }}>
          💰 Số dư ví: {walletBalance} coin
        </Text>

        <TouchableOpacity
          style={{
            marginTop: 12,
            backgroundColor: colors.primary,
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={() => navigation.navigate("Wallet", { userId: user.id })}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Quản lý ví & Nạp tiền</Text>
        </TouchableOpacity>
      </View>

      {/* Card hành động */}
      <View style={{ marginHorizontal: 16, borderRadius: 16, overflow: "hidden" }}>
        <TouchableOpacity
          style={[styles.actionItem, { backgroundColor: colors.surface }]}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Ionicons name="create-outline" size={20} color={colors.primary} />
          <Text style={styles.actionText}>Chỉnh sửa thông tin</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.border} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionItem, { backgroundColor: colors.surface }]}
          onPress={() => navigation.navigate("ChangePassword")}
        >
          <Ionicons name="lock-closed-outline" size={20} color={colors.primary} />
          <Text style={styles.actionText}>Đổi mật khẩu</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.border} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionItem, { backgroundColor: "#FF6B6B" }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={[styles.actionText, { color: "#fff" }]}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
