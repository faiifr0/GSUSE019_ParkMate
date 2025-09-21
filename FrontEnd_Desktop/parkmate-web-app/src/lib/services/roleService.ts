import axiosClient from "../axiosClient";

export type RoleResponse = {
  id: string;
  name: string;
  description: string;
};

const roleService = {
  getAll: async(): 
  Promise<RoleResponse[]> => {
    try {
      const res = await axiosClient.get<RoleResponse[]>("/role");
      return res.data;
    } catch (error) {
      console.error("❌ Error get all roles:", error);
      throw error;
    }
  },  
};

export default roleService;
