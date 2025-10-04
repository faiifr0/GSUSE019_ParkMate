import axiosClient from "../axiosClient";
import { userCreateModel } from "@/lib/model/userCreateModel";
import { userUpdateModel } from "@/lib/model/userUpdateModel";

export type LoginResponse = {
  accessToken: string;
};

export type CreateUserResponse = {
  username: string;
  email: string;
}

export type UserResponse = {
  id: number;
  username: string;
  email: string;
  password: string;
  parkBranchId: number;
  parkBranchName: string;
  roles?: {
    id: number;
    roleId: number;
    roleName: string;
  } [];
  wallet?: {
    id: number;
    balance: number;
  }
  createdAt: string;
  updatedAt: string;
  fullName: string;
  phoneNumber: string;
  dob: string;
}

const userService = {
  login: async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    try {
      const res = await axiosClient.post<LoginResponse>("/users/login", {
        email,
        password,
      });
      return res.data;
    } catch (error) {
      console.error("❌ Error logging in:", error);
      throw error;
    }
  },

  getAll: async (): Promise<UserResponse[]> => {
    try {
      const res = await axiosClient.get<UserResponse[]>("/users");

      if (!Array.isArray(res.data)) {
        throw new Error("❌ Response data is not an array");
      }
      
      return res.data;      
    } catch (error) {
      console.error("❌ Error fetching all users:", error);
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

  createUser: async (model?: userCreateModel): Promise<CreateUserResponse> => {
    try {
      const res = await axiosClient.post<CreateUserResponse>("/users/register/staff", model);
      return res.data;
    } catch (error) {
      console.error("❌ Error create user:", error);
      throw error;
    }
  },

  updateUser: async (id: string, model?: userUpdateModel): Promise<UserResponse> => {
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
