// src/api/axiosClient.ts
import axios, { InternalAxiosRequestConfig } from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../redux/store";
import { logout } from "../redux/userSlice";

function decodeJWT(token: string): any | null {
  try {
    const payload = token.split(".")[1];
    const decoded =
      Platform.OS === "web"
        ? atob(payload) // web
        : Buffer.from(payload, "base64").toString("utf-8"); // native
    return JSON.parse(decoded);
  } catch {
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
  } else {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userId");
  }
}

const axiosClient = axios.create({
  baseURL:
    Platform.OS === "android"
      ? "http://192.168.1.16:8080/api"
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

// Response interceptor → xử lý 401/403
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      await removeToken();
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export { getToken, decodeJWT, removeToken }; // ✅ export thêm để import bên ngoài
export default axiosClient;
