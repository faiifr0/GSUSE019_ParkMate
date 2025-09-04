import axiosClient from "../lib/axiosClient";
import { userUpdateModel } from "@/model/userUpdateModel";

export type LoginResponse = {
  accessToken: string;
};

export type UserResponse = {
  id: string;
  username: string;
  password: string;
  parkBranchId: string;
  roleId: string;
  walletId: string;
}

const userService = {
  login: async (
    username: string,
    password: string
  ): Promise<LoginResponse> => {
    try {
      const res = await axiosClient.post<LoginResponse>("users/login", {
        username,
        password,
      });
      return res.data;
    } catch (error) {
      console.error("❌ Error logging in:", error);
      throw error;
    }
  },

  getUserById: async (id: string): Promise<UserResponse> => {
    try {
      const res = await axiosClient.get<UserResponse>(`/users/${id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
      throw error;
    }
  },

  updateUser: async (id: string, model: userUpdateModel): Promise<UserResponse> => {
    try {
      const res = await axiosClient.put<UserResponse>(`/users/${id}`, model);
      return res.data;
    } catch (error) {
      console.error("❌ Error update profile:", error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      localStorage.removeItem("token");
    } catch (error) {
      console.error("❌ Error logging out:", error);
      throw error;
    }
  },
};

export default userService;
