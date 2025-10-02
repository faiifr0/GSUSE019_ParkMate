import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Platform } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AuthLayout from "../../components/AuthLayout";
import { images } from "../../constants/images";
import { useAuth } from "../../hooks/useAuth";

export default function LoginScreen() {
  const { login, loading } = useAuth();
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("#F44336");

  // 👇 Check autofill trên web
  useEffect(() => {
    if (Platform.OS === "web") {
      const timer = setTimeout(() => {
        const emailInput = document.querySelector<HTMLInputElement>("#email");
        const passwordInput = document.querySelector<HTMLInputElement>("#password");

        if (emailInput?.value && !email) setEmail(emailInput.value);
        if (passwordInput?.value && !password) setPassword(passwordInput.value);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const onLoginPress = async () => {
  try {
    const result = await login(email, password);

    if (result.success) {
      setSnackbarMsg("🎉 Đăng nhập thành công!");
      setSnackbarColor("#4CAF50");
    } else {
      setSnackbarMsg(result.error || "❌ Lỗi đăng nhập");
      setSnackbarColor("#F44336");
    }
  } catch (err: any) {
    setSnackbarMsg(err.message || "❌ Lỗi đăng nhập");
    setSnackbarColor("#F44336");
  }

  setSnackbarVisible(true);
};

  return (
    <AuthLayout
      snackbar={{
        visible: snackbarVisible,
        msg: snackbarMsg,
        color: snackbarColor,
      }}
      setSnackbarVisible={setSnackbarVisible}
    >
      {/* Logo + Tên ứng dụng */}
      <View style={styles.logoWrapper}>
        <Image source={{ uri: images.logo }} style={styles.logo} resizeMode="contain" />
        <Text style={styles.appSubtitle}>Bắt đầu hành trình kỷ niệm 🌈</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <TextInput
          label="Email"
          placeholder="example@gmail.com"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          outlineColor="#FF6B6B"
          activeOutlineColor="#673AB7"
          nativeID="email"
        />

        <TextInput
          label="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
          outlineColor="#FF6B6B"
          activeOutlineColor="#673AB7"
          nativeID="password"
        />

        <Button
          mode="contained"
          onPress={onLoginPress}
          loading={loading}
          style={[styles.button, Platform.OS === "web" && styles.buttonWeb]}
          labelStyle={{ fontSize: 16, fontWeight: "600" }}
          buttonColor="#FF6B6B"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>

        {/* Quên mật khẩu */}
        <View style={styles.linkRow}>
          <Text
            style={styles.forgotPassword}
            onPress={() => navigation.navigate("ForgotPassword" as never)}
          >
            Quên mật khẩu?
          </Text>

          {/* Đăng ký */}
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate("Register" as never)}
          >
            Chưa có tài khoản?{" "}
            <Text style={{ color: "#673AB7", fontWeight: "600" }}>Đăng ký</Text>
          </Text>
        </View>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  logoWrapper: { alignItems: "center", marginBottom: 20 },
  logo: { width: 240, height: 240, marginBottom: 6 },
  appSubtitle: { fontSize: 24, color: "#666" },
  form: { paddingHorizontal: 24, paddingTop: 16 },
  input: { marginBottom: 14 },
  button: {
    marginTop: 8,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: "#FF6B6B",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  buttonWeb: { boxShadow: "0px 3px 6px rgba(255, 107, 107, 0.25)" },
  forgotPassword: { marginTop: 12, textAlign: "center", color: "#673AB7", fontWeight: "500" },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    paddingHorizontal: 12,
  },
  linkText: { marginTop: 12, textAlign: "center", color: "#FF6B6B", fontWeight: "500" },
});
