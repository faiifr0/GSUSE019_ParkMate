import { branchReviewUpdateModel } from "@/model/branchReviewUpdateModel";
import axiosClient from "../lib/axiosClient";

export type branchReviewResponse = {
  name: string;
  description: string;
  basePrice: number;
  isCancelable: boolean;
  startTime: string;
  endTime: string;
};

const branchReview = {
  getAll: async(): 
    Promise<branchReviewResponse[]> => {
    try {
      const res = await axiosClient.get<branchReviewResponse[]>("/branch-review");
      return res.data;
    } catch (error) {
      console.error("❌ Error get all branch reviews:", error);
      throw error;
    }
  },

  getBranchReviewById: async (id: string): Promise<branchReviewResponse> => {
    try {
      const res = await axiosClient.get<branchReviewResponse>(`/branch-review/${id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching branch review id {" + id + "} :", error);
      throw error;
    }
  },

  updateBranchReview: async (
    id: string, 
    model?: branchReviewUpdateModel
  ): Promise<branchReviewResponse> => {
    try {
      const res = await axiosClient.put<branchReviewResponse>(`/branch-review/${id}`, model);
      return res.data;
    } catch (error) {
      console.error("❌ Error update branch review id {" + id + "} :", error);
      throw error;
    }
  },
};

export default branchReview;
