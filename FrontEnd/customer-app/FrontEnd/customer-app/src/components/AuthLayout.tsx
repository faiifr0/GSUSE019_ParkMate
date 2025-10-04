// src/components/AuthLayout.tsx
import React, { useEffect, useState } from "react";
import { View, Image, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { Snackbar, Text } from "react-native-paper";
import colors from "../constants/colors";
import { images } from "../constants/images";

interface AuthLayoutProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  snackbar: { visible: boolean; msg: string; color: string };
  setSnackbarVisible: (v: boolean) => void;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  snackbar,
  setSnackbarVisible,
}: AuthLayoutProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const opacity = useSharedValue(0);
  useEffect(() => { opacity.value = withTiming(1, { duration: 600 }); }, []);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  useEffect(() => {
    if (Platform.OS === "web" && images.loginSlides?.length > 0) {
      const interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % images.loginSlides.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, []);

  if (Platform.OS === "web") {
    return (
      <div style={webStyles.container}>
        <div style={webStyles.right}>
          {images.loginSlides?.length > 0 && (
            <img src={images.loginSlides[currentImage]} alt="slideshow" style={webStyles.image} />
          )}
        </div>
        <div style={webStyles.left}>
          <div style={webStyles.card}>
            {title && <h2 style={{ textAlign: "center", marginBottom: 4 }}>{title}</h2>}
            {subtitle && <p style={{ textAlign: "center", color: "#555", marginBottom: 20 }}>{subtitle}</p>}
            {children}
          </div>
        </div>

        <Snackbar
          visible={snackbar.visible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={2500}
          style={{
            backgroundColor: snackbar.color,
            borderRadius: 16,
            paddingHorizontal: 14,
            paddingVertical: 8,
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 15 }}>{snackbar.msg}</Text>
        </Snackbar>
      </div>
    );
  }

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
        <Animated.View style={[animatedStyle, { flex: 1 }]}>{children}</Animated.View>

        <Snackbar
          visible={snackbar.visible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={2500}
          style={{
            backgroundColor: snackbar.color,
            marginHorizontal: 16,
            borderRadius: 16,
            paddingHorizontal: 14,
            paddingVertical: 8,
            position: "absolute",
            bottom: 20,
            alignSelf: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 15 }}>{snackbar.msg}</Text>
        </Snackbar>
      </SafeAreaView>
    </LinearGradient>
  );
}

const webStyles: Record<string, React.CSSProperties> = {
  container: { display: "flex", flexDirection: "row", height: "100vh", width: "100%" },
  left: { flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "40px" },
  right: { flex: 1, overflow: "hidden" },
  card: { width: "100%", maxWidth: "400px", background: "rgba(255,255,255,0.7)", padding: "20px",margin:"40px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" },
  image: { width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.5s ease-in-out" },
};
