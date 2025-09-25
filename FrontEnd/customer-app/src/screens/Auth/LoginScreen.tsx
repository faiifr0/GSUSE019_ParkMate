import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AuthLayout from "../../components/AuthLayout";
import { useLogin } from "../../hooks/useLogin";
import { images } from "../../constants/images";

export default function LoginScreen() {
  const { handleLogin, loading } = useLogin();
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("#F44336");

  const onLoginPress = async () => {
    const result = await handleLogin(email, password);
    if (result.success) {
      setSnackbarMsg("🎉 Đăng nhập thành công!");
      setSnackbarColor("#4CAF50");
    } else {
      setSnackbarMsg(result.errors?.[0] || "❌ Lỗi đăng nhập");
      setSnackbarColor("#F44336");
    }
    setSnackbarVisible(true);
  };

  return (
    <AuthLayout
      title="ĐĂNG NHẬP"
      subtitle="Chào mừng quay trở lại 👋"
      snackbar={{ visible: snackbarVisible, msg: snackbarMsg, color: snackbarColor }}
      setSnackbarVisible={setSnackbarVisible}
    >
      <View style={styles.logoWrapper}>
        <Image source={{ uri: images.logo }} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.form}>
        <TextInput
          label="Email"
          placeholder="example@gmail.com"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          dense={false}
          style={styles.input}
          keyboardType="email-address"
          outlineColor="#FF6B6B"
          activeOutlineColor="#673AB7"
        />
        <TextInput
          label="Mật khẩu"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          dense={false}
          style={styles.input}
          outlineColor="#FF6B6B"
          activeOutlineColor="#673AB7"
        />
        <Button
          mode="contained"
          onPress={onLoginPress}
          loading={loading}
          style={styles.button}
          labelStyle={{ fontSize: 16, fontWeight: "600" }}
          buttonColor="#FF6B6B"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate("Register" as never)}
        >
          Chưa có tài khoản? <Text style={{ color: "#673AB7" }}>Đăng ký</Text>
        </Text>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  logoWrapper: {
    alignItems: "center",
    marginBottom: 28,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 8,
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
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
  linkText: {
    marginTop: 18,
    textAlign: "center",
    color: "#FF6B6B",
    fontWeight: "500",
  },
});
