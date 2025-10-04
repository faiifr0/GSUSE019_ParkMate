// src/screens/Promotion/PromotionScreen.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PromotionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Khuyến mãi</Text>
      <Text>Danh sách các ưu đãi dành cho bạn...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
});
