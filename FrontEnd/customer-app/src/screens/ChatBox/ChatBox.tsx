// src/components/ChatBot.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useAIChat } from "../../hooks/useAIChat";

const { width, height } = Dimensions.get("window");

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, loading } = useAIChat();

  // Floating button kéo thả
  const pan = useRef(new Animated.ValueXY({ x: width - 80, y: height - 180 }))
    .current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.extractOffset();
      },
    })
  ).current;

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  if (!open) {
    return (
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.floatingButton,
          { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
        ]}
      >
        <TouchableOpacity onPress={() => setOpen(true)} style={styles.chatBtn}>
          <Text style={{ fontSize: 24 }}>💬</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.chatContainer,
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.chatHeader}>
        <Text style={styles.chatTitle}>ParkMate ChatBot</Text>
        <TouchableOpacity onPress={() => setOpen(false)}>
          <Text style={styles.closeIcon}>▼</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách tin nhắn */}
      <FlatList
        style={styles.chatBody}
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.type === "user" ? styles.userMsg : styles.aiMsg,
            ]}
          >
            <Text style={{ color: item.type === "user" ? "#fff" : "#000" }}>
              {item.text}
            </Text>
          </View>
        )}
      />

      {/* Footer nhập tin nhắn */}
      <View style={styles.chatFooter}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tin nhắn..."
          value={input}
          onChangeText={setInput}
          editable={!loading}
        />
        <TouchableOpacity
          style={styles.sendBtn}
          onPress={handleSend}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff" }}>Gửi</Text>
          )}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    zIndex: 1000,
  },
  chatBtn: {
    backgroundColor: "#4ECDC4",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  chatContainer: {
    position: "absolute",
    width: 300,
    height: 400,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 10,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#4ECDC4",
    padding: 12,
  },
  chatTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeIcon: {
    color: "#fff",
    fontSize: 20,
  },
  chatBody: {
    flex: 1,
    padding: 10,
  },
  message: {
    marginVertical: 4,
    padding: 8,
    borderRadius: 8,
    maxWidth: "80%",
  },
  userMsg: {
    backgroundColor: "#4ECDC4",
    alignSelf: "flex-end",
  },
  aiMsg: {
    backgroundColor: "#f1f1f1",
    alignSelf: "flex-start",
  },
  chatFooter: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: "#4ECDC4",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
});
