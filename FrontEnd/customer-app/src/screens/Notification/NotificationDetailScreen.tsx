import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import styles from "../../styles/NotificationDetailScreenStyles";
import notificationService from "../../services/notificationService";
import { Notification } from "../../types/Notification";

export default function NotificationDetailScreen() {
  const route = useRoute();
  const { id } = route.params as { id: number };

  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotificationDetail = async () => {
      try {
        const data = await notificationService.getById(id);
        setNotification(data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết thông báo:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotificationDetail();
  }, [id]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#4ECDC4" />
      ) : notification ? (
        <>
          <Text style={styles.title}>#{notification.id} - {notification.notificationType}</Text>
          <Text style={styles.date}>
            Gửi lúc: {new Date(notification.sentAt).toLocaleString()}
          </Text>
          <Text style={styles.content}>{notification.message}</Text>
          <Text style={styles.status}>
            Trạng thái: {notification.status}
          </Text>
        </>
      ) : (
        <Text style={styles.noData}>Thông báo không tồn tại</Text>
      )}
    </View>
  );
}
