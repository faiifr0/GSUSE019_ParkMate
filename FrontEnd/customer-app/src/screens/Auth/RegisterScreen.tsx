import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AuthLayout from "../../components/AuthLayout";
import colors from "../../constants/colors";
import { useRegister } from "../../hooks/useRegister";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/userSlice";
import { UserRequest } from "../../types/User";

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
      title="ĐĂNG KÝ"
      subtitle="Tạo tài khoản mới ✨"
      snackbar={{ visible: snackbarVisible, msg: snackbarMsg, color: snackbarColor }}
      setSnackbarVisible={setSnackbarVisible}
    >
      <View style={styles.form}>
        <TextInput label="Email" value={email} onChangeText={setEmail} mode="outlined" style={styles.input} keyboardType="email-address"/>
        <TextInput label="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry mode="outlined" style={styles.input}/>
        <TextInput label="Xác nhận mật khẩu" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry mode="outlined" style={styles.input}/>
        <TextInput label="Họ và tên" value={fullName} onChangeText={setFullName} mode="outlined" style={styles.input}/>
        <TextInput label="Số điện thoại" value={phone} onChangeText={setPhone} mode="outlined" style={styles.input} keyboardType="phone-pad"/>
        <TextInput label="Ngày sinh (yyyy-mm-dd)" value={dob} onChangeText={setDob} mode="outlined" style={styles.input}/>
        <Button mode="contained" onPress={onRegisterPress} loading={loading} style={styles.button}>
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </Button>
        <Text style={styles.linkText} onPress={() => navigation.navigate("Login" as never)}>
          Đã có tài khoản? Đăng nhập
        </Text>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 4,
  },
  linkText: {
    marginTop: 16,
    textAlign: "center",
    color: colors.primary,
    fontWeight: "500",
  },
});
