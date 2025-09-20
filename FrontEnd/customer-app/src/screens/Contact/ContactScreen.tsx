// src/screens/Contact/ContactScreen.tsx
import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import colors from "../../constants/colors";

// Import JSON từ assets
import content from "../../../assets/contact.json";

export default function ContactScreen() {
  const data = content.contact;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liên hệ</Text>
      <Text style={styles.subtitle}>Hãy để lại thông tin để chúng tôi liên lạc với bạn</Text>

      <TextInput style={styles.input} placeholder="Tên" />
      <TextInput style={styles.input} placeholder="Email" />
      <TextInput style={styles.input} placeholder="Điện thoại" />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Tin nhắn"
        multiline
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Gửi</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 20 }}>
        <Text>📞 {data.phone}</Text>
        <Text>✉️ {data.email}</Text>
        <Text>📍 {data.address}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // 👉 dùng gradient thì nên gói bằng LinearGradient, còn nếu để đơn giản thì để backgroundColor
    backgroundColor: colors.background,
    padding: 20,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, color: colors.textPrimary },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 20 },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
