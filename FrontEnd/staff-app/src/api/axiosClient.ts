import axios from "axios";

// Base URL API (có thể đưa vào .env để dễ đổi)
const axiosClient = axios.create({
  baseURL: "https://parkmate-management-system.azurewebsites.net/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10s
});

// Thêm interceptor để tự động đính kèm token vào request
axiosClient.interceptors.request.use(
  async (config) => {
    // Lấy token từ AsyncStorage hoặc Redux (ví dụ)
    // import AsyncStorage from '@react-native-async-storage/async-storage';
    // const token = await AsyncStorage.getItem("accessToken");

    const token = null; // TODO: thay bằng logic lấy token của bạn
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý response lỗi chung
axiosClient.interceptors.response.use(
  (response) => {
    return response.data; // chỉ lấy data thay vì cả object axios
  },
  (error) => {
    console.error("API Error:", error?.response || error?.message);
    return Promise.reject(error?.response?.data || error);
  }
);

export default axiosClient;
