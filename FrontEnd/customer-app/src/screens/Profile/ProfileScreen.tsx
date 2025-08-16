import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
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

export default function ProfileScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.userInfo);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchUserInfo(user.id, user.token);
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
            <Text style={styles.info}>
              💰 Số dư ví: {userData?.wallet?.balance ?? 0} coin
            </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
  infoCard: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  info: {
    fontSize: 15,
    marginBottom: 6,
    color: "#444",
  },
  actionCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  actionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: "#333",
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
});
