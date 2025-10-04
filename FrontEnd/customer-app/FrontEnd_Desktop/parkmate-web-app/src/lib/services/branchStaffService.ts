import { branchStaffUpdateModel } from "@/lib/model/branchStaffUpdateModel";
import axiosClient from "../axiosClient";
import { branchStaffCreateModel } from "@/lib/model/branchStaffCreateModel";

export type branchStaffResponse = {
  id: number;    
  userId: number;      
  username: string;    
  userFullName: string;
  parkBranchId: number;
  parkBranchName: string;
  role: string;
  description: string;
  createdAt: string;     
  updatedAt: string;
  status: boolean;
};

const branchStaffService = {
  getAll: async(): 
    Promise<branchStaffResponse[]> => {
    try {
      const res = await axiosClient.get<branchStaffResponse[]>("/branch-staff");
      return res.data;
    } catch (error) {
      console.error("❌ Error get all branch staffs:", error);
      throw error;
    }
  },

  getBranchStaffById: async (id: string): Promise<branchStaffResponse> => {
    try {
      const res = await axiosClient.get<branchStaffResponse>(`/branch-staff/${id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching branch staff id {" + id + "} :", error);
      throw error;
    }
  },

  createBranchStaff: async (model?: branchStaffCreateModel): Promise<branchStaffResponse> => {
    try {
      const res = await axiosClient.post<branchStaffResponse>(`/branch-staff`, model);
      return res.data;
    } catch (error) {
      console.error("❌ Error create branch staff : ", error);
      throw error;
    }
  },

  updateBranchStaff: async (
    id: string, 
    model?: branchStaffUpdateModel
  ): Promise<branchStaffResponse> => {
    try {
      const res = await axiosClient.put<branchStaffResponse>(`/branch-staff/${id}`, model);
      return res.data;
    } catch (error) {
      console.error("❌ Error update branch staff id {" + id + "} :", error);
      throw error;
    }
  },

  deleteBranchStaff: async (
    id: string, 
  ): Promise<void> => {
    try {
      const res = await axiosClient.delete<void>(`/branch-staff/${id}`);      
    } catch (error) {
      console.error("❌ Error delete branch staff id {" + id + "} :", error);
      throw error;
    }
  },
};

export default branchStaffService;
