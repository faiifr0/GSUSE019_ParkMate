// src/api/axiosClient.ts
import axios, { InternalAxiosRequestConfig } from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../redux/store";
import { logout } from "../redux/userSlice";
import {jwtDecode} from "jwt-decode";
import { UserResponse } from "../types/User";

export function decodeJWT(token: string): any | null {
  try {
    return jwtDecode(token);
  } catch (err) {
    console.error("JWT decode error:", err);
    return null;
  }
}

export async function getToken(): Promise<string | null> {
  if (Platform.OS === "web") return localStorage.getItem("token");
  return AsyncStorage.getItem("token");
}

export async function setToken(token: string) {
  if (Platform.OS === "web") localStorage.setItem("token", token);
  else await AsyncStorage.setItem("token", token);
}

export async function removeToken() {
  if (Platform.OS === "web") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("walletId");
  } else {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("walletId");
  }
}

// walletId helpers
export async function setWalletId(walletId: number) {
  if (Platform.OS === "web") localStorage.setItem("walletId", walletId.toString());
  else await AsyncStorage.setItem("walletId", walletId.toString());
}

export async function getWalletId(): Promise<number | null> {
  if (Platform.OS === "web") {
    const id = localStorage.getItem("walletId");
    return id ? parseInt(id, 10) : null;
  }
  const id = await AsyncStorage.getItem("walletId");
  return id ? parseInt(id, 10) : null;
}

// user helpers
export async function setUser(user: UserResponse) {
  const s = JSON.stringify(user);
  if (Platform.OS === "web") localStorage.setItem("user", s);
  else await AsyncStorage.setItem("user", s);
}

export async function getUser(): Promise<UserResponse | null> {
  let raw: string | null;
  if (Platform.OS === "web") raw = localStorage.getItem("user");
  else raw = await AsyncStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

const axiosClient = axios.create({
  baseURL: "https://gsuse019-parkmate.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});

// attach token
axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // don't add Authorization for login/register request (they don't need it)
    if (config.url?.includes("/users/login") || config.url?.includes("/users/register")) {
      return config;
    }
    const token = await getToken();
    if (token) {
      const payload = decodeJWT(token);
      if (payload?.exp && Date.now() >= payload.exp * 1000) {
        await removeToken();
        store.dispatch(logout());
        return Promise.reject({ message: "Token expired" });
      }
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// response interceptor
axiosClient.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      await removeToken();
      store.dispatch(logout());
    } else if (error.request && !error.response) {
      console.warn("Network / CORS error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
