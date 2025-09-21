import { branchAmenityCreateModel } from "@/lib/model/branchAmenityCreateModel";
import axiosClient from "../axiosClient";
import { branchPromotionUpdateModel } from "@/lib/model/branchPromotionUpdateModel";
import { branchAmenityUpdateModel } from "@/lib/model/branchAmenityUpdateModel";

export type branchAmenityResponse = {
  // ### STILL EMPTY
};

const branchAmenityService = {
  getAll: async(): 
    Promise<branchAmenityResponse[]> => {
    try {
      const res = await axiosClient.get<branchAmenityResponse[]>("/branch-amenity");
      return res.data;
    } catch (error) {
      console.error("❌ Error get all branch amenities: ", error);
      throw error;
    }
  },

  getBranchAmenityById: async (id: string): Promise<branchAmenityResponse> => {
    try {
      const res = await axiosClient.get<branchAmenityResponse>(`/branch-amenity/${id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching branch amenity id {" + id + "} : ", error);
      throw error;
    }
  },

  createBranchAmenity: async (model: branchAmenityCreateModel): Promise<branchAmenityResponse> => {
    try {
      const res = await axiosClient.post<branchAmenityResponse>(`/branch-amenity`);
      return res.data;
    } catch (error) {
      console.error("❌ Error create branch amenity : ", error);
      throw error;
    }
  },

  updateBranchAmenity: async (
    id: string, 
    model: branchAmenityUpdateModel
  ): Promise<branchAmenityResponse> => {
    try {
      const res = await axiosClient.put<branchAmenityResponse>(`/branch-amenity/${id}`, model);
      return res.data;
    } catch (error) {
      console.error("❌ Error update branch amenity id {" + id + "} : ", error);
      throw error;
    }
  },
};

export default branchAmenityService;
