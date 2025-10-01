// src/services/userService.ts
import axiosClient from "../api/axiosClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { UserRequest, UserResponse } from "../types/User";

// ---------------- AUTH -----------------

// Đăng ký user thường
export const registerUser = (data: UserRequest) => {
return axiosClient.post<{ username: string; email: string }>(
"/users/register",
data
);
};

// Đăng nhập
export const loginUser = async (email: string, password: string) => {
const res = await axiosClient.post<{ accessToken: string }>("/users/login", {
email,
password,
});

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

// ---------------- USER -----------------

// Lấy thông tin user theo ID
export const getUserById = (id: number) => {
return axiosClient.get<UserResponse>(`/users/${id}`);
};

// Cập nhật thông tin user
export const updateUser = (id: number, data: Partial<UserRequest>) => {
return axiosClient.put<UserResponse>(`/users/${id}`, data);
};
