// src/services/userService.ts
import axiosClient from "../api/axiosClient";
import { UserRequest, UserResponse } from "../types/User";

export const registerUser = (data: UserRequest) => {
  return axiosClient.post("/users/register", data);
};

export const loginUser = (email: string, password: string) => {
  return axiosClient.post<{ accessToken: string; user: UserResponse }>(
    "/users/login",
    { email, password }
  );
};

export const logoutUser = () => {
  return axiosClient.post("/users/logout");
};

export const getUserById = (id: number) => {
  return axiosClient.get<UserResponse>(`/users/${id}`);
};

export const updateUser = (id: number, data: Partial<UserRequest>) => {
  return axiosClient.put<UserResponse>(`/users/${id}`, data);
};
