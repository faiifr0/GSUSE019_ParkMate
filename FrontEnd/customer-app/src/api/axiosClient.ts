// src/api/axiosClient.ts
import axios, { InternalAxiosRequestConfig } from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosClient = axios.create({
  baseURL:
    Platform.OS === "android"
      ? "http://192.168.1.194:8080/api"
      : "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 📌 Request Interceptor
axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // ❌ Không gắn token cho login/register
    if (
      config.url?.includes("/users/login") ||
      config.url?.includes("/users/register")
    ) {
      delete config.headers.Authorization;
      return config;
    }

    let token: string | null = null;
    if (Platform.OS === "web") {
      token = localStorage.getItem("token");
    } else {
      token = await AsyncStorage.getItem("token");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 📌 Response Interceptor
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
