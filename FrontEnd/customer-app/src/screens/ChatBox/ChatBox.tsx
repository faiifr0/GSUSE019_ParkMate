import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, FlatList, Text, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { sendChat } from "../../services/aiChatService";
import { AIChatResponse } from "../../types/AIChat";
import colors from "../../constants/colors";

export default function ChatBox() {
  const [messages, setMessages] = useState<{ from: "user" | "ai"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      setLoading(true);
      const res: AIChatResponse = await sendChat({ prompt: input.trim(), history: messages.map((m) => m.text) });
      setMessages((prev) => [...prev, { from: "ai", text: res.answer }]);
    } catch {
      setMessages((prev) => [...prev, { from: "ai", text: "❌ Có lỗi khi gọi AI" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              alignSelf: item.from === "user" ? "flex-end" : "flex-start",
              backgroundColor: item.from === "user" ? colors.primary : "#ddd",
              borderRadius: 12,
              padding: 10,
              marginVertical: 4,
              maxWidth: "75%",
            }}
          >
            <Text style={{ color: item.from === "user" ? "#fff" : "#000" }}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 10 }}
      />

      {/* input + send */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 8, borderTopWidth: 1, borderColor: "#ccc" }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Nhập tin nhắn..."
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 8,
            marginRight: 8,
          }}
        />
        <TouchableOpacity onPress={handleSend} disabled={loading}>
          <Ionicons name="send" size={24} color={loading ? "#aaa" : colors.primary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
