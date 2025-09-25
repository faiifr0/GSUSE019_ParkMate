// src/screens/Contact/ContactScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Import JSON từ assets
import content from "../../../assets/contact.json";

export default function ContactScreen() {
  const data = content.contact;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    // Logic gửi form
    console.log({ name, email, phone, message });
    alert("Gửi thông tin thành công!");
  };

  return (
    <LinearGradient
      colors={["#FF9A8B", "#FF6A88", "#FF99AC", "#00C9FF"]}
      start={[0, 0]}
      end={[1, 1]}
      style={{ flex: 1 }}
    >

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Liên hệ với chúng tôi</Text>
        <Text style={styles.subtitle}>Hãy để lại thông tin để chúng tôi liên lạc với bạn</Text>

        <TextInput
          style={styles.input}
          placeholder="Tên"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Điện thoại"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={[styles.input, { height: 120 }]}
          placeholder="Tin nhắn"
          value={message}
          onChangeText={setMessage}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleSend}>
          <Text style={styles.buttonText}>Gửi</Text>
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>📞 {data.phone}</Text>
          <Text style={styles.infoText}>✉️ {data.email}</Text>
          <Text style={styles.infoText}>📍 {data.address}</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#fff",
  },
  button: {
    backgroundColor: "#4A00E0",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  infoContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
  },
  infoText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 6,
  },
});
