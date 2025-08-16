import axiosClient from "../api/axiosClient";

// Đăng ký
export const registerUser = (email: string, password: string) => {
  return axiosClient.post("/users/register", { email, password });
};

// Đăng nhập
export const loginUser = (username: string, password: string) => {
  return axiosClient.post("/users/login", { username, password });
};

// Lấy thông tin user theo ID
export const getUserById = (id: number) => {
  return axiosClient.get(`/users/${id}`);
};

// Cập nhật thông tin user
export const updateUser = (id: number, data: { password?: string; parkBranchId?: number; roleId?: number }) => {
  return axiosClient.put(`/users/${id}`, data);
};
