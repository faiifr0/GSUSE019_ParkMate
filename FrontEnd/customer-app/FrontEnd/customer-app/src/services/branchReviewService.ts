import apiClient from "../api/axiosClient";
import { BranchReview, CreateBranchReviewDto } from "../types/BranchReview";

const ENDPOINT = "/branch-review";

export const branchReviewService = {
  // Lấy tất cả đánh giá
  getAll: async (): Promise<BranchReview[]> => {
    const res = await apiClient.get<BranchReview[]>(ENDPOINT);
    return res.data;
  },

  // Lấy đánh giá theo id
  getById: async (id: number): Promise<BranchReview> => {
    const res = await apiClient.get<BranchReview>(`${ENDPOINT}/${id}`);
    return res.data;
  },

  // Lấy danh sách đánh giá của 1 chi nhánh
  getOfBranch: async (branchId: number): Promise<BranchReview[]> => {
    const res = await apiClient.get<BranchReview[]>(`${ENDPOINT}/of-branch/${branchId}`);
    return res.data;
  },

  // Tạo đánh giá mới
  create: async (data: CreateBranchReviewDto): Promise<BranchReview> => {
    const res = await apiClient.post<BranchReview>(ENDPOINT, data);
    return res.data;
  },

};
