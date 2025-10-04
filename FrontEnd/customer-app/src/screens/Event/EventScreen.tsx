// src/screens/Event/EventDetailScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { useNavigation } from "@react-navigation/native";
import eventService from "../../services/eventService";
import { Event } from "../../types/Event";
import colors from "../../constants/colors";

type Props = NativeStackScreenProps<RootStackParamList, "EventDetail">;
type EventStatus = { text: string; color: string };

export default function EventDetailScreen({ route }: Props) {
  const { eventId } = route.params;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  const windowWidth = Dimensions.get("window").width;
  const isWeb = Platform.OS === "web";
  const containerWidth = isWeb ? "70%" : "100%";

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const data = await eventService.getById(eventId);
      setEvent(data);
    } catch (err: any) {
      console.log("Error fetching event:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getEventStatus = (): EventStatus => {
    if (!event) return { text: "", color: "#000" };
    const now = new Date();
    const start = new Date(event.startAt);
    const end = new Date(event.endAt);

    if (now >= start && now <= end) return { text: "Đang diễn ra", color: "green" };
    if (now < start) return { text: "Sắp diễn ra", color: "#FFA500" };
    return { text: "Đã kết thúc", color: "#999" };
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red" }}>Không tìm thấy sự kiện</Text>
      </View>
    );
  }

  const status = getEventStatus();

  return (
    <View style={styles.container}>
      {/* Back Button fixed top-left */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backText}>🔙 Quay lại</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        <View style={[styles.innerContainer, { width: containerWidth }]}>
          {/* Event Image */}
          {event.imageUrl && (
            <Image source={{ uri: event.imageUrl }} style={styles.eventImage} resizeMode="cover" />
          )}

          {/* Event Info */}
          <View style={styles.content}>
            <Text style={styles.title}>{event.name}</Text>
            <Text style={styles.description}>{event.description}</Text>
            <Text style={styles.date}>
              🗓️ {new Date(event.startAt).toLocaleString()} - {new Date(event.endAt).toLocaleString()}
            </Text>
            <Text style={[styles.status, { color: status.color }]}>{status.text}</Text>
            <Text style={styles.branch}>📍 Chi nhánh ID: {event.parkBranchId}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  innerContainer: { flex: 1, alignItems: "center" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 16,
    zIndex: 10,
    padding: 8,
    backgroundColor: colors.surface,
    borderRadius: 8,
    elevation: 5,
  },
  backText: { fontSize: 16, color: colors.primary, fontWeight: "600" },

  eventImage: {
    width: "100%",
    height: 280,
    borderRadius: 12,
    marginBottom: 16,
  },
  content: { paddingHorizontal: 12 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 12, color: colors.textPrimary },
  description: { fontSize: 18, marginBottom: 12, color: colors.textSecondary, lineHeight: 26 },
  date: { fontSize: 14, marginBottom: 8, color: "#555" },
  status: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  branch: { fontSize: 14, color: "#777" },
});
