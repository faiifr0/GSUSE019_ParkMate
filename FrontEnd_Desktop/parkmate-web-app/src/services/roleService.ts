import axiosClient from "../lib/axiosClient";

export type roleResponse = {
  id: string;
  name: string;
  description: string;
};

const roleService = {
  getAll: async(): 
    Promise<roleResponse[]> => {
    try {
      const res = await axiosClient.get<roleResponse[]>("/role");
      return res.data;
    } catch (error) {
      console.error("❌ Error get all roles:", error);
      throw error;
    }
  },  
};

export default roleService;
