import axios, { InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie"

const axiosClient = axios.create({
  baseURL: "https://parkmate-management-system.azurewebsites.net/api",
  //baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 📌 Request interceptor
axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {   
    const token = Cookies.get("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Log request details
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

// 📌 Response interceptor
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
