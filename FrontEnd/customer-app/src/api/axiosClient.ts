import axios, { InternalAxiosRequestConfig } from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🟢 Helper: decode JWT payload
function decodeJWT(token: string): any | null {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload); // web
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// 🟢 Token
async function getToken(): Promise<string | null> {
  if (Platform.OS === "web") return localStorage.getItem("token");
  return AsyncStorage.getItem("token");
}

// 🟢 UserId
async function setUserId(userId: number) {
  if (Platform.OS === "web") localStorage.setItem("userId", userId.toString());
  else await AsyncStorage.setItem("userId", userId.toString());
}
async function getUserId(): Promise<number | null> {
  if (Platform.OS === "web") return Number(localStorage.getItem("userId") || null);
  const uid = await AsyncStorage.getItem("userId");
  return uid ? Number(uid) : null;
}

// 🟢 WalletId
async function setWalletId(walletId: number) {
  if (Platform.OS === "web") localStorage.setItem("walletId", walletId.toString());
  else await AsyncStorage.setItem("walletId", walletId.toString());
}
async function getWalletId(): Promise<number | null> {
  if (Platform.OS === "web") return Number(localStorage.getItem("walletId") || null);
  const w = await AsyncStorage.getItem("walletId");
  return w ? Number(w) : null;
}

const axiosClient = axios.create({
  baseURL:
    Platform.OS === "android"
      ? "http://192.168.1.217:8080/api"
      : "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor
axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (config.url?.includes("/users/login") || config.url?.includes("/users/register")) {
      delete config.headers.Authorization;
      return config;
    }

    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      const storedUserId = await getUserId();
      if (!storedUserId) {
        const payload = decodeJWT(token);
        const userId = payload?.sub || payload?.userId;
        if (userId) await setUserId(Number(userId));
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => {
    console.log("📥 Response:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    if (error.response) {
      console.log("❌ API Error Response:", {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      console.log("❌ No Response:", error.config?.url);
    } else {
      console.log("❌ Error Message:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
export { getUserId, setUserId, getWalletId, setWalletId, decodeJWT, getToken };
