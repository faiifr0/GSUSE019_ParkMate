import axiosClient from "../lib/axiosClient";

export const loginUser = (username: string, password: string) => {
  return axiosClient.post("/users/login", { username, password });
};

export const getUserById = (id: number, token: string) => {
  return axiosClient.get(`/users/${id}`);
};

export const updateUser = (id: number, data: { password?: string; parkBranchId?: number; roleId?: number }) => {
  return axiosClient.put(`/users/${id}`, data);
};
