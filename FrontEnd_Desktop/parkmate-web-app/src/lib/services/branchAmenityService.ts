import { branchAmenityCreateModel } from "@/lib/model/branchAmenityCreateModel";
import axiosClient from "../axiosClient";
import { branchAmenityUpdateModel } from "@/lib/model/branchAmenityUpdateModel";
import { updateImageModel } from "../model/updateImageModel";

export type branchAmenityResponse = {
  id: string;
  parkBranchId: string;
  amenityTypeId: string;  
  name: string;
  description: string;
  imageUrl: string;
  status: boolean;
};

const branchAmenityService = {
  getAllOfBranch: async (id: string): 
    Promise<branchAmenityResponse[]> => {
    try {
      const res = await axiosClient.get<branchAmenityResponse[]>(`/branch-amenities/of-branch/${id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Error get all branch amenities: ", error);
      throw error;
    }
  },

  getBranchAmenityById: async (id: string): Promise<branchAmenityResponse> => {
    try {
      const res = await axiosClient.get<branchAmenityResponse>(`/branch-amenities/${id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching branch amenity id {" + id + "} : ", error);
      throw error;
    }
  },

  createBranchAmenity: async (model?: branchAmenityCreateModel): Promise<branchAmenityResponse> => {
    try {
      const res = await axiosClient.post<branchAmenityResponse>(`/branch-amenities`, model);
      return res.data;
    } catch (error) {
      console.error("❌ Error create branch amenity : ", error);
      throw error;
    }
  },

  updateBranchAmenity: async (
    id: string, 
    model?: branchAmenityUpdateModel
  ): Promise<branchAmenityResponse> => {
    try {
      const res = await axiosClient.put<branchAmenityResponse>(`/branch-amenities/${id}`, model);
      return res.data;
    } catch (error) {
      console.error("❌ Error update branch amenity id {" + id + "} : ", error);
      throw error;
    }
  },

  deleteBranchAmenity: async (
    id: string,     
  ): Promise<void> => {
    try {
      await axiosClient.delete<void>(`/branch-amenities/${id}`);      
    } catch (error) {
      console.error("❌ Error delete branch amenity id {" + id + "} : ", error);
      throw error;
    }
  },

  updateBranchAmenityImage: async (
    id: string, 
    model?: updateImageModel
  ): Promise<void> => {
    try {
      const res = await axiosClient.put<updateImageModel>(`/branch-amenities/${id}/image`, model);
    } catch (error) {
      console.error("❌ Error update amenity image :", error);
      throw error;
    }
  },
};

export default branchAmenityService;
