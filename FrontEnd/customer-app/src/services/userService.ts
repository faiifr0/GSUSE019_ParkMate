// src/services/authService.ts
import axiosClient from "../api/axiosClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Đăng ký
export const registerUser = (email: string, password: string) => {
  return axiosClient.post("/users/register", { email, password });
};

// Đăng nhập
export const loginUser = async (username: string, password: string) => {
  const res = await axiosClient.post("/users/login", { username, password });

  if (res.data?.accessToken) {
    if (Platform.OS === "web") {
      localStorage.setItem("token", res.data.accessToken);
    } else {
      await AsyncStorage.setItem("token", res.data.accessToken);
    }
  }

  return res;
};

// Đăng xuất
export const logoutUser = async () => {
  if (Platform.OS === "web") {
    localStorage.removeItem("token");
  } else {
    await AsyncStorage.removeItem("token");
  }
};

// Lấy thông tin user theo ID
export const getUserById = (id: number) => {
  return axiosClient.get(`/users/${id}`);
};

// Cập nhật thông tin user
export const updateUser = (
  id: number,
  data: { password?: string; parkBranchId?: number; roleId?: number }
) => {
  return axiosClient.put(`/users/${id}`, data);
};
