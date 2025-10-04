import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ListRenderItem,
} from "react-native";
import styles from "../../styles/NotificationScreenStyles";
import { useNavigation } from "@react-navigation/native";
import notificationService from "../../services/notificationService";
import { Notification } from "../../types/Notification";

// 👇 Định nghĩa type cho navigation
type RootStackParamList = {
  NotificationDetail: { id: number };
};

type NotificationScreenNavigationProp = ReturnType<
  typeof useNavigation<import("@react-navigation/native").NavigationProp<RootStackParamList>>
>;

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NotificationScreenNavigationProp>();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data: Notification[] = await notificationService.getAll();
        setNotifications(data);
      } catch (error) {
        console.error("Lỗi khi lấy thông báo:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const renderItem: ListRenderItem<Notification> = ({ item }) => (
    <TouchableOpacity
      style={styles.notificationItem}
      onPress={() => navigation.navigate("NotificationDetail", { id: item.id })}
    >
      <Text style={styles.title}>{item.message}</Text>
      <Text style={styles.time}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thông Báo</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4ECDC4" />
      ) : notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.noData}>Không có thông báo</Text>
      )}
    </View>
  );
}
