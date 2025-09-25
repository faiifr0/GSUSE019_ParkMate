import { useState } from "react";
import { loginUser } from "../services/userService";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/userSlice";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { loginSchema } from "../validation/loginValidation";

export function useLogin() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const saveToken = async (token: string) => {
    if (Platform.OS === "web") {
      localStorage.setItem("token", token);
    } else {
      await SecureStore.setItemAsync("token", token);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    // ✅ Validate FE trước khi gọi API
    try {
      await loginSchema.validate({ email, password }, { abortEarly: false });
    } catch (validationError: any) {
      return { success: false, errors: validationError.errors };
    }

    try {
      setLoading(true);
      const response = await loginUser(email, password);
      const token = response.data?.accessToken;
      if (!token) throw new Error("No token");

      await saveToken(token);
      dispatch(setCredentials({ token, userInfo: { email } }));

      return { success: true };
    } catch (err) {
      return { success: false, errors: ["Sai tài khoản hoặc mật khẩu"] };
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading };
}
