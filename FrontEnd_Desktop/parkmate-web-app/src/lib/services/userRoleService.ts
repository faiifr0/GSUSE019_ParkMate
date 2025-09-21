import { userRoleUpdateModel } from "@/lib/model/userRoleUpdateModel";
import axiosClient from "../axiosClient";

export type UserRoleResponse = {
  id: string;
  name: string;
  description: string;
};

const userRoleService = {
  updateUserRole: async(
    id: string,
    model?: userRoleUpdateModel
  ): 
  Promise<UserRoleResponse> => {
    try {
      const res = await axiosClient.post<UserRoleResponse>("/user-role", model);
      return res.data;
    } catch (error) {
      console.error("❌ Error get update user role:", error);
      throw error;
    }
  },  
};

export default userRoleService;
