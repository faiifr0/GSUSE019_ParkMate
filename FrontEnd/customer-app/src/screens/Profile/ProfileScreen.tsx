// src/screens/Profile/ProfileScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import styles from "../../styles/ProfileScreenStyles";
import { useWallet } from "../../hooks/useWallet";
import { useAuth } from "../../hooks/useAuth"; // ✅ Hook logout chính thống
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function ProfileScreen({ navigation }: any) {
  const user = useSelector((state: RootState) => state.user.userInfo);
  const { logout } = useAuth(); // ✅ dùng useAuth để gọi logout
  const { balance: walletBalance, refreshWallet } = useWallet();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) refreshWallet();
  }, [user]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
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
          {user?.username || "Khách hàng"}
        </Text>
        <Text style={{ fontSize: 14, color: "#eee" }}>
          {user?.email || "Chưa có email"}
        </Text>
        <Text style={{ fontSize: 14, color: "#eee" }}>
          {user?.phoneNumber || "Chưa có số điện thoại"}
        </Text>
      </View>

      {/* Card thông tin ví */}
      <View
        style={{
          margin: 16,
          padding: 16,
          borderRadius: 16,
          backgroundColor: colors.surface,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          elevation: 3,
        }}
      >
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
          onPress={() => navigation.navigate("Wallet", { userId: user?.id })}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Quản lý ví & Nạp tiền
          </Text>
        </TouchableOpacity>
      </View>

      {/* Action list */}
      <View style={{ marginHorizontal: 16, borderRadius: 16, overflow: "hidden" }}>
        <TouchableOpacity
          style={[styles.actionItem, { backgroundColor: colors.surface, borderBottomWidth: 0 }]}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Ionicons name="create-outline" size={20} color={colors.primary} />
          <Text style={styles.actionText}>Chỉnh sửa thông tin</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.border} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionItem, { backgroundColor: colors.surface, borderBottomWidth: 0 }]}
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
