import axiosClient from "../axiosClient";
import { gameUpdateModel } from "../model/gameUpdateModel";

export type ReviewResponse = {
  id: string,
  userId: string,
  email: string,
  branchId: string,
  rating: number,
  comment: string,
  approved: boolean,
  createdAt: string,
  updatedAt: string
};

const reviewService = {
  getAllOfBranch: async (id: string): 
    Promise<ReviewResponse[]> => {
    try {
      const res = await axiosClient.get<ReviewResponse[]>(`/branch-review/of-branch/${id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Error get all branch reviews: ", error);
      throw error;
    }
  },

  getReviewById: async (id: string): Promise<ReviewResponse> => {
    try {
      const res = await axiosClient.get<ReviewResponse>(`/branch-review/${id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching branch review id {" + id + "} : ", error);
      throw error;
    }
  },

  updateReview: async (
    id: string, 
    model?: gameUpdateModel
  ): Promise<ReviewResponse> => {
    try {
      const res = await axiosClient.put<ReviewResponse>(`/branch-review/${id}`, model);
      return res.data;
    } catch (error) {
      console.error("❌ Error update branch review id {" + id + "} : ", error);
      throw error;
    }
  },
};

export default reviewService;
