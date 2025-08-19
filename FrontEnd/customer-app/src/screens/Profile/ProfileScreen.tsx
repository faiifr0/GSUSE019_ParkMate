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
import walletService from "../../services/walletService";
import styles from "../../styles/ProfileScreenStyles";

export default function ProfileScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.userInfo);
  const [userData, setUserData] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchUserInfo(user.id, user.token);
      fetchWalletBalance(user.id);
    }
  }, [user]);

  const fetchUserInfo = async (id: number, token: string) => {
    try {
      setLoading(true);
      const data = await getUserById(id, token);
      setUserData(data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin user:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletBalance = async (userId: number) => {
    try {
      const wallet = await walletService.getById(userId);
      setWalletBalance(wallet.balance);
    } catch (error) {
      console.error("Lỗi khi lấy số dư ví:", error);
      setWalletBalance(0);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigation.replace("Login");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Avatar + Thông tin cơ bản */}
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://i.pravatar.cc/150?img=12",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{userData?.username || "Khách hàng"}</Text>
        <Text style={styles.email}>{userData?.email || "No email"}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FF6B6B" />
      ) : (
        <>
          {/* Card thông tin */}
          <View style={styles.infoCard}>
            <Text style={styles.info}>
              🏢 Chi nhánh: {userData?.parkBranch?.name || "Chưa có"}
            </Text>
            <Text style={styles.info}>
              🎭 Vai trò: {userData?.role?.name || "Khách"}
            </Text>
            <Text style={styles.info}>💰 Số dư ví: {walletBalance} coin</Text>
          </View>

          {/* Card các hành động */}
          <View style={styles.actionCard}>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => navigation.navigate("TopUp")}
            >
              <Ionicons name="card-outline" size={20} color="#4A90E2" />
              <Text style={styles.actionText}>Nạp tiền</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => navigation.navigate("EditProfile")}
            >
              <Ionicons name="create-outline" size={20} color="#4A90E2" />
              <Text style={styles.actionText}>Chỉnh sửa thông tin</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => navigation.navigate("ChangePassword")}
            >
              <Ionicons name="lock-closed-outline" size={20} color="#4A90E2" />
              <Text style={styles.actionText}>Đổi mật khẩu</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionItem, styles.logoutItem]}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
              <Text style={[styles.actionText, { color: "#FF6B6B" }]}>
                Đăng xuất
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}