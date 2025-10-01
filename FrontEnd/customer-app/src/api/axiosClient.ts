// src/api/axiosClient.ts
import axios, { InternalAxiosRequestConfig } from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../redux/store";
import { logout } from "../redux/userSlice";
import { jwtDecode } from "jwt-decode";

function decodeJWT(token: string): any | null {
  try {
    return jwtDecode(token);
  } catch (err) {
    console.error("JWT decode error:", err);
    return null;
  }
}

async function getToken(): Promise<string | null> {
  if (Platform.OS === "web") return localStorage.getItem("token");
  return AsyncStorage.getItem("token");
}

async function removeToken() {
  if (Platform.OS === "web") {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("walletId");
  } else {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userId");
    await AsyncStorage.removeItem("walletId");
  }
}

// ✅ Thêm hàm lưu / lấy walletId
async function setWalletId(walletId: number) {
  if (Platform.OS === "web") {
    localStorage.setItem("walletId", walletId.toString());
  } else {
    await AsyncStorage.setItem("walletId", walletId.toString());
  }
}

async function getWalletId(): Promise<string | null> {
  if (Platform.OS === "web") return localStorage.getItem("walletId");
  return AsyncStorage.getItem("walletId");
}

const axiosClient = axios.create({
  baseURL:
    Platform.OS === "android"
      ? "http://192.168.1.38:8080/api"
      : "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

// Request interceptor → gắn token
axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (
      config.url?.includes("/users/login") ||
      config.url?.includes("/users/register")
    ) {
      delete config.headers.Authorization;
      return config;
    }

    const token = await getToken();
    if (token) {
      // check token expired
      const payload = decodeJWT(token);
      if (payload?.exp && Date.now() >= payload.exp * 1000) {
        await removeToken();
        store.dispatch(logout());
        return Promise.reject({ message: "Token expired" });
      }

      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → xử lý 401/403 + network error
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        await removeToken();
        store.dispatch(logout());
      }
    } else if (error.request) {
      console.log("Lỗi kết nối server:", error.message);
      alert(
        "Hệ thống đang bảo trì hoặc không thể kết nối server. Vui lòng thử lại sau!"
      );
    } else {
      console.log("Error", error.message);
    }

    return Promise.reject(error);
  }
);

export { getToken, decodeJWT, removeToken, setWalletId, getWalletId }; // ✅ export thêm
export default axiosClient;
