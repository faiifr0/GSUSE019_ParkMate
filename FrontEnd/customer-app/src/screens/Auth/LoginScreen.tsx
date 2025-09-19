// src/screens/Auth/LoginScreen.tsx
import React, { useState, useEffect, useCallback } from "react";
import { View, TouchableOpacity, Image, Platform } from "react-native";
import { TextInput, Button, Text, Snackbar, ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import * as SecureStore from "expo-secure-store";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types"; // file types.ts của bạn
import { setCredentials } from "../../redux/userSlice";
import styles from "../../styles/LoginScreenStyles";
import colors from "../../constants/colors";
import { loginUser } from "../../services/userService";

const images = [
  "https://images.pexels.com/photos/326083/pexels-photo-326083.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/242764/pexels-photo-242764.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://rawpixel.com/image/5924192/photo-image-light-public-domain-shape",
  "https://images.pexels.com/photos/34950/ferris-wheel-sky-winning.jpg?auto=compress&cs=tinysrgb&w=800",
];

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarColor, setSnackbarColor] = useState(colors.secondary);
  const [currentImage, setCurrentImage] = useState(0);
  const navigation = useNavigation<LoginScreenNavigationProp>();


  // Animation
  const opacity = useSharedValue(0);
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
  }, []);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  // Slideshow cho web
  useEffect(() => {
    if (Platform.OS === "web") {
      const interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, []);

  const showMessage = (msg: string, type: "error" | "success" | "warn") => {
    setSnackbarMsg(msg);
    setSnackbarColor(
      type === "success" ? colors.success : type === "error" ? colors.error : colors.warning
    );
    setSnackbarVisible(true);
  };

  const saveToken = async (token: string) => {
    if (Platform.OS === "web") {
      localStorage.setItem("token", token);
    } else {
      await SecureStore.setItemAsync("token", token);
    }
  };

const handleLogin = useCallback(async () => {
    if (!username.trim() || !password) {
      showMessage("⚠️ Vui lòng nhập tài khoản và mật khẩu", "warn");
      return;
    }
    try {
      setLoading(true);
      const response = await loginUser(username, password);
      const token = response.data?.accessToken;
      if (!token) throw new Error("No token");

      await saveToken(token);
      dispatch(setCredentials({ token, userInfo: { username } }));

      showMessage("🎉 Đăng nhập thành công!", "success");

      // 👉 navigate qua MainApp
      navigation.reset({
        index: 0,
        routes: [{ name: "MainApp" }],
      });
    } catch (err) {
      console.error(err);
      showMessage("❌ Sai tài khoản hoặc mật khẩu", "error");
    } finally {
      setLoading(false);
    }
  }, [username, password, dispatch, navigation]);

  // 👉 Giao diện cho Web
  if (Platform.OS === "web") {
    return (
      <div style={webStyles.container}>
        <div style={webStyles.left}>
          <div style={webStyles.card}>
            <Image
              source={require("../../../assets/logo.png")}
              style={{ width: 120, height: 120, alignSelf: "center", marginBottom: 24 }}
              resizeMode="contain"
            />
            <TextInput
              label="Email"
              value={username}
              onChangeText={setUsername}
              mode="outlined"
              style={[styles.input, { backgroundColor: "#fff" }]}
              outlineStyle={styles.inputOutline}
              left={<TextInput.Icon icon="email" />}
              activeOutlineColor={colors.primary}
            />
            <TextInput
              label="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureText}
              mode="outlined"
              style={[styles.input, { backgroundColor: "#fff" }]}
              outlineStyle={styles.inputOutline}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={secureText ? "eye-off" : "eye"}
                  onPress={() => setSecureText(!secureText)}
                />
              }
              activeOutlineColor={colors.primary}
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              disabled={loading}
              style={styles.button}
              buttonColor={loading ? colors.disabled : colors.primary}
              labelStyle={styles.buttonLabel}
            >
              {loading ? <ActivityIndicator color={colors.surface} /> : "Đăng nhập"}
            </Button>

            <View style={styles.linkContainer}>
              <TouchableOpacity>
                <Text style={styles.link}>Quên mật khẩu?</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.highlightLink}>Đăng ký</Text>
              </TouchableOpacity>
            </View>
          </div>
        </div>

        <div style={webStyles.right}>
          <img src={images[currentImage]} alt="slideshow" style={webStyles.image} />
        </div>
      </div>
    );
  }

  // 👉 Giao diện cho Mobile App
  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
      style={styles.safe}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safe}>
        <Animated.View style={[animatedStyle]}>
          <Image
            source={require("../../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <TextInput
            label="Email"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            style={styles.input}
            outlineStyle={styles.inputOutline}
            left={<TextInput.Icon icon="email" />}
            activeOutlineColor={colors.primary}
          />
          <TextInput
            label="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureText}
            mode="outlined"
            style={styles.input}
            outlineStyle={styles.inputOutline}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={secureText ? "eye-off" : "eye"}
                onPress={() => setSecureText(!secureText)}
              />
            }
            activeOutlineColor={colors.primary}
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            disabled={loading}
            style={styles.button}
            buttonColor={loading ? colors.disabled : colors.primary}
            labelStyle={styles.buttonLabel}
          >
            {loading ? <ActivityIndicator color={colors.surface} /> : "Đăng nhập"}
          </Button>

          <View style={styles.linkContainer}>
            <TouchableOpacity>
              <Text style={styles.link}>Quên mật khẩu?</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.highlightLink}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={2500}
          style={{
            backgroundColor: snackbarColor,
            marginHorizontal: 16,
            borderRadius: 16,
            paddingHorizontal: 14,
            paddingVertical: 8,
          }}
          action={{ label: "OK", onPress: () => setSnackbarVisible(false), textColor: "#fff" }}
        >
          <Text style={{ color: "#fff", fontSize: 15 }}>{snackbarMsg}</Text>
        </Snackbar>
      </SafeAreaView>
    </LinearGradient>
  );
}

const webStyles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "row",
    height: "100vh",
    width: "100%",
    background: "#f5f7fa",
  },
  left: { flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "40px" },
  right: { flex: 1, overflow: "hidden", position: "relative" },
  card: {
    width: "100%",
    maxWidth: "400px",
    background: "#fff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  image: { width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.5s ease-in-out" },
};
