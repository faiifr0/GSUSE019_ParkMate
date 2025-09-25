import { parkBranchCreateModel } from "@/lib/model/parkBranchCreateModel";
import axiosClient from "../axiosClient";
import {parkBranchUpdateModel} from "@/lib/model/parkBranchUpdateModel";
import { updateImageModel } from "../model/updateImageModel";

export type parkBranchResponse = {
  id: number;
  name: string;
  address: string;
  location: string;
  openTime: string;
  closeTime: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  imageUrl: string;
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
      const res = await axiosClient.post<parkBranchResponse>("/park-branch", model);
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

  updateParkBranchImage: async (
    id: string, 
    model?: updateImageModel
  ): Promise<void> => {
    try {
      const res = await axiosClient.put<parkBranchResponse>(`/park-branch/${id}/image`, model);
    } catch (error) {
      console.error("❌ Error update park branch image :", error);
      throw error;
    }
  },
};

export default parkBranchService;
