// src/components/ChatBot.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet } from "react-native";
import { useAIChat } from "../../hooks/useAIChat";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, loading } = useAIChat();

  const handleSend = () => {
    if (input.trim() === "") return;
    sendMessage(input);
    setInput("");
  };

  if (!open) {
    return (
      <TouchableOpacity style={styles.floatingButton} onPress={() => setOpen(true)}>
        <Text style={{ fontSize: 20 }}>💬</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.chatContainer}>
      <View style={styles.header}>
        <Text style={{ fontWeight: "bold" }}>AI Chat</Text>
        <TouchableOpacity onPress={() => setOpen(false)}>
          <Text style={{ fontSize: 18 }}>✕</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={[styles.message, item.type === "ai" ? styles.aiMessage : styles.userMessage]}>
            <Text>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          style={styles.input}
          placeholder="Type a message..."
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text>➡️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4ECDC4",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  chatContainer: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 300,
    height: 400,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#4ECDC4",
  },
  message: { marginVertical: 5, marginHorizontal: 10, padding: 8, borderRadius: 8 },
  userMessage: { backgroundColor: "#FF6B6B", alignSelf: "flex-end" },
  aiMessage: { backgroundColor: "#ECECEC", alignSelf: "flex-start" },
  inputContainer: { flexDirection: "row", padding: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 5 },
  sendButton: { marginLeft: 5, justifyContent: "center", alignItems: "center" },
});
