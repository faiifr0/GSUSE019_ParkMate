import axiosClient from "../lib/axiosClient";
import { branchPromotionCreateModel } from "@/model/branchPromotionCreateModel";
import { branchPromotionUpdateModel } from "@/model/branchPromotionUpdateModel";

export type branchPromotionResponse = {
  id: string;
  parkBranchId: string;
  description: string;
  discount: number;
  from: string;
  to: string;
  isActive: boolean; 
  createdAt: string;
  updatedAt: string;
};

const branchPromotionService = {
  getAll: async(): 
    Promise<branchPromotionResponse[]> => {
    try {
      const res = await axiosClient.get<branchPromotionResponse[]>("/branch-promotion");
      return res.data;
    } catch (error) {
      console.error("❌ Error get all branch promotions: ", error);
      throw error;
    }
  },

  getBranchPromotionById: async (id: string): Promise<branchPromotionResponse> => {
    try {
      const res = await axiosClient.get<branchPromotionResponse>(`/branch-promotion/${id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching branch promotion id {" + id + "} : ", error);
      throw error;
    }
  },

  createBranchPromotion: async (model?: branchPromotionCreateModel): Promise<branchPromotionResponse> => {
    try {
      const res = await axiosClient.post<branchPromotionResponse>(`/branch-promotion`);
      return res.data;
    } catch (error) {
      console.error("❌ Error create branch promotion : ", error);
      throw error;
    }
  },

  updateBranchPromotion: async (
    id: string, 
    model: branchPromotionUpdateModel
  ): Promise<branchPromotionResponse> => {
    try {
      const res = await axiosClient.put<branchPromotionResponse>(`/branch-promotion/${id}`, model);
      return res.data;
    } catch (error) {
      console.error("❌ Error update branch promotion id {" + id + "} : ", error);
      throw error;
    }
  },
};

export default branchPromotionService;
