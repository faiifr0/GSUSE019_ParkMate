export interface BranchReview {
  id: number;
  userId: number;
  email: string;
  branchId: number;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

// DTO khi khách tạo đánh giá
export interface CreateBranchReviewDto {
  userId: number;
  branchId: number;
  rating: number;
  comment: string;
  approved?: boolean; // mặc định true/false do backend quyết định
}
