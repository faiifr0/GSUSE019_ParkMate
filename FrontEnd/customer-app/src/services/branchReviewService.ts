import apiClient from "../api/axiosClient";
import { BranchReview, CreateBranchReviewDto } from "../types/BranchReview";

const ENDPOINT = "/branch-review";

export const branchReviewService = {
  getAll: async (): Promise<BranchReview[]> => {
    const res = await apiClient.get(ENDPOINT);
    return res.data;
  },

  getById: async (id: number): Promise<BranchReview> => {
    const res = await apiClient.get(`${ENDPOINT}/${id}`);
    return res.data;
  },

  create: async (data: CreateBranchReviewDto): Promise<BranchReview> => {
    const res = await apiClient.post(ENDPOINT, data);
    return res.data;
  },
};
