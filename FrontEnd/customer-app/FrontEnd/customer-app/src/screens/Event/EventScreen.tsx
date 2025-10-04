// src/screens/Event/EventScreen.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function EventScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sự kiện</Text>
      <Text>Hiển thị danh sách sự kiện sắp diễn ra...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
});
