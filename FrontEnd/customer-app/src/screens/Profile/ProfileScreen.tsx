import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { logout } from "../../redux/userSlice";
import { getUserById } from "../../services/userService";
import { Ionicons } from "@expo/vector-icons";
import { walletService } from "../../services/walletService";
import colors from "../../constants/colors";
import styles from "../../styles/ProfileScreenStyles";

export default function ProfileScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.userInfo);
  const [userData, setUserData] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchUserInfo(user.id);
      fetchWalletBalance(user.id);
    }
  }, [user]);

  const fetchUserInfo = async (id: number) => {
    try {
      setLoading(true);
      const res = await getUserById(id);
      setUserData(res.data || null);
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

  const handleLogout = () => {
    dispatch(logout());
    navigation.replace("Login");
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ alignItems: "center", padding: 24, backgroundColor: colors.primary, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
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
      <View style={{
        margin: 16,
        padding: 16,
        borderRadius: 16,
        backgroundColor: colors.surface,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}>
        <Text style={{ fontSize: 16, marginBottom: 8, color: colors.textPrimary }}>🏢 Chi nhánh: {userData?.parkBranch?.name || "Chưa có"}</Text>
        <Text style={{ fontSize: 16, marginBottom: 8, color: colors.textPrimary }}>🎭 Vai trò: {userData?.role?.name || "Khách"}</Text>
        <Text style={{ fontSize: 16, marginBottom: 8, color: colors.textPrimary }}>💰 Số dư ví: {walletBalance} coin</Text>

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
