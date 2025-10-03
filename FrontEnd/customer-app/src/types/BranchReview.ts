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

// DTO khi tạo đánh giá mới
export interface CreateBranchReviewDto {
  userId: number;
  branchId: number;
  rating: number;
  comment: string;
  approved?: boolean; // optional, backend có thể set mặc định
}
