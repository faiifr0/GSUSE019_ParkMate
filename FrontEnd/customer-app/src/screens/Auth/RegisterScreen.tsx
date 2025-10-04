import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Platform } from "react-native";
import { TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AuthLayout from "../../components/AuthLayout";
import colors from "../../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { UserRequest } from "../../types/User";
import { useAuth } from "../../hooks/useAuth";
import { CommonActions } from '@react-navigation/native';
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

export default function RegisterScreen() {
  const { register, loading } = useAuth();
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState(""); // yyyy-mm-dd

  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarColor, setSnackbarColor] = useState(colors.error);

  // --- Validation ---
  const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
  const validatePassword = (value: string) => value.length >= 6;
  const validateConfirmPassword = (value: string) => value === password;
  const validateFullName = (value: string) => value.trim().length > 0;
  const validatePhone = (value: string) => /^\d{9,15}$/.test(value);
  const validateDob = (value: string) => moment(value, "YYYY-MM-DD", true).isValid();

  const showError = (field: string, value: string) => {
    if (!touched[field]) return "";
    switch (field) {
      case "email": return validateEmail(value) ? "" : "Email không hợp lệ";
      case "password": return validatePassword(value) ? "" : "Mật khẩu ít nhất 6 ký tự";
      case "confirmPassword": return validateConfirmPassword(value) ? "" : "Mật khẩu không khớp";
      case "fullName": return validateFullName(value) ? "" : "Họ và tên không được để trống";
      case "phone": return validatePhone(value) ? "" : "Số điện thoại không hợp lệ";
      case "dob": return validateDob(value) ? "" : "Ngày sinh không hợp lệ (yyyy-mm-dd)";
      default: return "";
    }
  };

  const onRegisterPress = async () => {
    // validate all
    const fields = { email, password, confirmPassword, fullName, phone, dob };
    let hasError = false;
    Object.keys(fields).forEach(key => {
      setTouched(prev => ({ ...prev, [key]: true }));
      if (showError(key, (fields as any)[key])) hasError = true;
    });
    if (hasError) return;

    const payload: UserRequest = {
      username: email.split("@")[0],
      email,
      password,
      fullName,
      phoneNumber: phone,
      dob,
    };

    const result = await register(payload);
    if (result.success && result.user) {
      setSnackbarMsg("🎉 Đăng ký thành công!");
      setSnackbarColor(colors.success);
      setSnackbarVisible(true);
      setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({ index: 0, routes: [{ name: 'Home' }] })
        );
      }, 500);
    } else {
      setSnackbarMsg(result.error || "❌ Đăng ký thất bại");
      setSnackbarColor(colors.error);
      setSnackbarVisible(true);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDob(moment(selectedDate).format("YYYY-MM-DD"));
      setTouched(prev => ({ ...prev, dob: true }));
    }
  };

  return (
    <AuthLayout
      snackbar={{ visible: snackbarVisible, msg: snackbarMsg, color: snackbarColor }}
      setSnackbarVisible={setSnackbarVisible}
    >
      <View style={styles.form}>
        <Text style={styles.title}>Đăng ký</Text>
        <Text style={styles.slogan}>
          🎡 Trải nghiệm công viên giải trí dễ dàng cùng{" "}
          <Text style={{ color: "#FF6B6B", fontWeight: "bold" }}>ParkMate</Text>!
        </Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
          error={!!showError("email", email)}
        />
        {showError("email", email) ? <Text style={styles.error}>{showError("email", email)}</Text> : null}

        <TextInput
          label="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
          onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
          error={!!showError("password", password)}
        />
        {showError("password", password) ? <Text style={styles.error}>{showError("password", password)}</Text> : null}

        <TextInput
          label="Xác nhận mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
          onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
          error={!!showError("confirmPassword", confirmPassword)}
        />
        {showError("confirmPassword", confirmPassword) ? <Text style={styles.error}>{showError("confirmPassword", confirmPassword)}</Text> : null}

        <TextInput
          label="Họ và tên"
          value={fullName}
          onChangeText={setFullName}
          mode="outlined"
          style={styles.input}
          onBlur={() => setTouched(prev => ({ ...prev, fullName: true }))}
          error={!!showError("fullName", fullName)}
        />
        {showError("fullName", fullName) ? <Text style={styles.error}>{showError("fullName", fullName)}</Text> : null}

        <TextInput
          label="Số điện thoại"
          value={phone}
          onChangeText={setPhone}
          mode="outlined"
          style={styles.input}
          keyboardType="phone-pad"
          onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
          error={!!showError("phone", phone)}
        />
        {showError("phone", phone) ? <Text style={styles.error}>{showError("phone", phone)}</Text> : null}

        <TextInput
          label="Ngày sinh (yyyy-mm-dd)"
          value={dob}
          onChangeText={setDob}
          mode="outlined"
          style={styles.input}
          onFocus={() => setShowDatePicker(true)}
          onBlur={() => setTouched(prev => ({ ...prev, dob: true }))}
          error={!!showError("dob", dob)}
        />
        {showError("dob", dob) ? <Text style={styles.error}>{showError("dob", dob)}</Text> : null}

        {showDatePicker && (
          <DateTimePicker
            value={dob ? new Date(dob) : new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            maximumDate={new Date()}
            onChange={handleDateChange}
          />
        )}

        <TouchableOpacity onPress={onRegisterPress} style={{ borderRadius: 10, overflow: "hidden", marginTop: 12 }}>
          <LinearGradient
            colors={["#673AB7", "#FF6B6B"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>{loading ? "Đang đăng ký..." : "Đăng ký"}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.linkText} onPress={() => navigation.navigate("Login" as never)}>
          Đã có tài khoản? <Text style={{ color: "#673AB7" }}>Đăng nhập</Text>
        </Text>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: { paddingHorizontal: 16 },
  input: { marginBottom: 4 },
  button: { width: "100%", paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  linkText: { marginTop: 16, textAlign: "center", color: colors.primary, fontWeight: "500" },
  title: { fontSize: 30, fontWeight: "bold", color: "#d51b1bff", textAlign: "center", marginBottom: 16 },
  slogan: { textAlign: "center", fontSize: 18, color: "#555", fontStyle: "italic" },
  error: { color: colors.error, fontSize: 12, marginBottom: 8 },
});
