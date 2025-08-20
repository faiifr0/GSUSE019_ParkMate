import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { getShifts } from "../../services/shiftService";
import { Shift } from "../../types/Shift";

const WorkScheduleScreen = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getShifts();
        setShifts(data);
      } catch (error) {
        console.error("Failed to fetch shifts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderItem = ({ item }: { item: Shift }) => {
    const start = `${item.startTime.hour}:${item.startTime.minute.toString().padStart(2, "0")}`;
    const end = `${item.endTime.hour}:${item.endTime.minute.toString().padStart(2, "0")}`;
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.description}</Text>
        <Text style={styles.time}>
          {start} - {end}
        </Text>
        <Text style={styles.meta}>Created by: {item.createdBy}</Text>
      </View>
    );
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách ca làm việc</Text>
      <FlatList data={shifts} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} />
    </View>
  );
};

export default WorkScheduleScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  card: { backgroundColor: "#f9f9f9", padding: 12, borderRadius: 8, marginBottom: 10, elevation: 2 },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  time: { fontSize: 14, color: "#333", marginBottom: 4 },
  meta: { fontSize: 12, color: "#888" },
});
