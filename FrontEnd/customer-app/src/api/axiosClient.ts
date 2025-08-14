import axios, { InternalAxiosRequestConfig } from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosClient = axios.create({
  baseURL: "https://parkmate-management-system.azurewebsites.net/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 📌 Interceptor request
axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    let token: string | null = null;

    if (Platform.OS === "web") {
      // Web: dùng localStorage
      token = localStorage.getItem("token");
    } else {
      // Mobile: dùng AsyncStorage
      token = await AsyncStorage.getItem("token");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Log chi tiết request
    console.log("📤 Request:", {
      url: `${config.baseURL}${config.url}`,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });

    return config;
  },
  (error) => {
    console.log("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// 📌 Interceptor response
axiosClient.interceptors.response.use(
  (response) => {
    // ✅ Log chi tiết response
    console.log("📥 Response:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    if (error.response) {
      // ✅ Log khi server trả lỗi
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
