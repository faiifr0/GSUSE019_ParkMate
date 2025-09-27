import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AuthLayout from "../../components/AuthLayout";
import colors from "../../constants/colors";
import { useRegister } from "../../hooks/useRegister";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/userSlice";
import { UserRequest } from "../../types/User";
import { LinearGradient } from "expo-linear-gradient";

export default function RegisterScreen() {
  const { handleRegister, loading } = useRegister();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarColor, setSnackbarColor] = useState(colors.error);

  const onRegisterPress = async () => {
    const payload: UserRequest = {
      username: email.split("@")[0],
      email,
      password,
      fullName,
      phoneNumber: phone,
      dob,
    };

    const result = await handleRegister(payload, confirmPassword);

    if (result.success && result.data) {
      dispatch(
        setCredentials({
          token: result.data.token,
          userInfo: result.data.userInfo,
        })
      );
      setSnackbarMsg("🎉 Đăng ký thành công!");
      setSnackbarColor(colors.success);
      setSnackbarVisible(true);
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" as never }],
        });
      }, 1500);
    } else {
      setSnackbarMsg(result.errors?.join("\n") || "❌ Đăng ký thất bại");
      setSnackbarColor(colors.error);
      setSnackbarVisible(true);
    }
  };

return (
  <AuthLayout
    snackbar={{ visible: snackbarVisible, msg: snackbarMsg, color: snackbarColor }}
    setSnackbarVisible={setSnackbarVisible}
  >
    <View style={styles.form}>
      {/* 👉 Tiêu đề */}
      <Text style={styles.title}>Đăng ký</Text>
      {/* 👉 Slogan */}
    <Text style={styles.slogan}>
      🎡 Trải nghiệm công viên giải trí dễ dàng cùng{" "}
      <Text style={{ color: "#FF6B6B", fontWeight: "bold" }}>ParkMate</Text>!
    </Text>

      {/* Các ô input */}
      <TextInput label="Email" value={email} onChangeText={setEmail} mode="outlined" style={styles.input} keyboardType="email-address"/>
      <TextInput label="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry mode="outlined" style={styles.input}/>
      <TextInput label="Xác nhận mật khẩu" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry mode="outlined" style={styles.input}/>
      <TextInput label="Họ và tên" value={fullName} onChangeText={setFullName} mode="outlined" style={styles.input}/>
      <TextInput label="Số điện thoại" value={phone} onChangeText={setPhone} mode="outlined" style={styles.input} keyboardType="phone-pad"/>
      <TextInput label="Ngày sinh (yyyy-mm-dd)" value={dob} onChangeText={setDob} mode="outlined" style={styles.input}/>

      {/* Nút đăng ký */}
      <TouchableOpacity onPress={onRegisterPress} style={{ borderRadius: 10, overflow: "hidden", marginTop: 12 }}>
        <LinearGradient
          colors={["#673AB7", "#FF6B6B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Link đăng nhập */}
      <Text style={styles.linkText} onPress={() => navigation.navigate("Login" as never)}>
        Đã có tài khoản? <Text style={{ color: "#673AB7" }}>Đăng nhập</Text>
      </Text>
    </View>
  </AuthLayout>
);

}

const styles = StyleSheet.create({
  form: {
    paddingHorizontal: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  linkText: {
    marginTop: 16,
    textAlign: "center",
    color: colors.primary,
    fontWeight: "500",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#d51b1bff",
    textAlign: "center",
    marginBottom: 16,
  },
  slogan: {
    textAlign: "center",
    fontSize: 18,
    color: "#555",
    fontStyle: "italic",
  },
});
