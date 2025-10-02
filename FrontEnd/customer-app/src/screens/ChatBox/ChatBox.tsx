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
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function ChatBot() {
  const [open, setOpen] = useState(false);

  // PanResponder để kéo thả nút chat
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
        pan.extractOffset(); // giữ vị trí mới
      },
    })
  ).current;

  if (!open) {
    // Floating button khi chưa mở
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

  // Khi mở chatbox
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

      <View style={styles.chatBody}>
        <Text>Xin chào 👋! Tôi có thể giúp gì cho bạn?</Text>
      </View>

      <View style={styles.chatFooter}>
        <Text style={{ color: "#999" }}>Type here...</Text>
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
  chatFooter: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
});
