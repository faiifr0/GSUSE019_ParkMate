import axios, { InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie"

const axiosClient = axios.create({
  //baseURL: "https://parkmate-management-system.azurewebsites.net/api",
  //baseURL: "http://localhost:8080/api", // for local testing
  baseURL: "https://gsuse019-parkmate.onrender.com/api",
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

      if (error.response.status === 403) {
        window.location.href = '/error-403'; // ✅ redirect to forbidden page
      }
      if (error.response.status === 404) {
        window.location.href = '/error-404'; // ✅ redirect to forbidden page
      }
    } else if (error.request) {
      console.log("❌ No Response:", error.config?.url);
    } else {
      console.log("❌ Error Message:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
