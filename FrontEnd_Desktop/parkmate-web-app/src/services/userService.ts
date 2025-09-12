import axiosClient from "../lib/axiosClient";
import { userCreateModel } from "@/model/userCreateModel";
import { userUpdateModel } from "@/model/userUpdateModel";

export type LoginResponse = {
  accessToken: string;
};

export type CreateUserResponse = {
  username: string;
  email: string;
}

export type UserResponse = {
  id: string;
  username: string;
  email: string;
  password: string;
  parkBranch?: {
    id: string;
  }
  userRoles?: {
    id: string;
    role?: {
      id: string;
      name: string;
    };
  } [];
  wallet?: {
    id: string;
    balance: number;
  }
  createdAt: string;
  updatedAt: string;
}

const userService = {
  login: async (
    username: string,
    password: string
  ): Promise<LoginResponse> => {
    try {
      const res = await axiosClient.post<LoginResponse>("/users/login", {
        username,
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
      //console.log("Data:", res.data);
      //Array.isArray(res.data) ? console.log("Its an array!") : console.log("No its not!");
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
      const res = await axiosClient.post<CreateUserResponse>("/users/register", model);
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
