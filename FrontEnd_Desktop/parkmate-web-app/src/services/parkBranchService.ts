import { parkBranchCreateModel } from "@/model/parkBranchCreateModel";
import axiosClient from "../lib/axiosClient";
import {parkBranchUpdateModel} from "@/model/parkBranchUpdateModel";

export type parkBranchResponse = {
  id: number;
  name: string;
  address: string;
  location: string;
  open: string;
  close: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};

const parkBranchService = {
  getAll: async(): 
    Promise<parkBranchResponse[]> => {
    try {
      const res = await axiosClient.get<parkBranchResponse[]>("/park-branch");
      return res.data;
    } catch (error) {
      console.error("❌ Error get all park branches:", error);
      throw error;
    }
  },

  getParkBranchById: async (id: string): Promise<parkBranchResponse> => {
    try {
      const res = await axiosClient.get<parkBranchResponse>(`/park-branch/${id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching park branch id {" + id + "} :", error);
      throw error;
    }
  },

  createParkBranch: async (    
    model?: parkBranchCreateModel
  ): Promise<parkBranchResponse> => {
    try {
      const res = await axiosClient.post<parkBranchResponse>(`/park-branch/`, model);
      return res.data;
    } catch (error) {
      console.error("❌ Error create park branch: ", error);
      throw error;
    }
  },

  updateParkBranch: async (
    id: string, 
    model?: parkBranchUpdateModel
  ): Promise<parkBranchResponse> => {
    try {
      const res = await axiosClient.put<parkBranchResponse>(`/park-branch/${id}`, model);
      return res.data;
    } catch (error) {
      console.error("❌ Error update park branch id {" + id + "} :", error);
      throw error;
    }
  },
};

export default parkBranchService;
