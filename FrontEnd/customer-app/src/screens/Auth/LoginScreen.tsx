import React, { useState, useEffect, useCallback } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { TextInput, Button, Text, Snackbar, ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useDispatch } from "react-redux";
import * as SecureStore from "expo-secure-store";
import { setCredentials } from "../../redux/userSlice";
import axiosClient from "../../api/axiosClient";
import styles from "../../styles/LoginScreenStyles";
import colors from "../../constants/colors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  MainApp: undefined;
  ForgotPassword: undefined;
  Register: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen({ navigation }: { navigation: LoginScreenNavigationProp }) {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarColor, setSnackbarColor] = useState(colors.secondary);

  const opacity = useSharedValue(0);
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const showMessage = (msg: string, type: "error" | "success" | "warn") => {
    setSnackbarMsg(msg);
    setSnackbarColor(
      type === "success" ? colors.success : type === "error" ? colors.error : colors.warning
    );
    setSnackbarVisible(true);
  };

  const handleLogin = useCallback(async () => {
    if (!username.trim() || !password) {
      showMessage("⚠️ Vui lòng nhập tài khoản và mật khẩu", "warn");
      return;
    }
    try {
      setLoading(true);
      const response = await axiosClient.post("/users/login", { username, password });
      const token = response.data?.accessToken;
      if (!token) throw new Error("No token");
      await SecureStore.setItemAsync("token", token);
      dispatch(setCredentials({ token, userInfo: { username } }));
      showMessage("🎉 Đăng nhập thành công!", "success");
      navigation.replace("MainApp");
    } catch {
      showMessage("❌ Sai tài khoản hoặc mật khẩu", "error");
    } finally {
      setLoading(false);
    }
  }, [username, password, navigation, dispatch]);

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
      style={styles.safe}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safe}>
        {/* Logo + tiêu đề */}
        <Image source={require("../../../assets/logo.png")} style={styles.logo} resizeMode="contain" />

        {/* Form phẳng, bo tròn đẹp */}
        <Animated.View style={[animatedStyle]}>
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
            right={<TextInput.Icon icon={secureText ? "eye-off" : "eye"} onPress={() => setSecureText(!secureText)} />}
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

          {/* Link quên mk + đăng ký */}
          <View style={styles.linkContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
              <Text style={styles.link}>Quên mật khẩu?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.highlightLink}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Snackbar đẹp hơn */}
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
          <Text style={{ color: "#fff", fontSize: 15, fontFamily: "Poppins-Medium" }}>
            {snackbarMsg}
          </Text>
        </Snackbar>
      </SafeAreaView>
    </LinearGradient>
  );
}
