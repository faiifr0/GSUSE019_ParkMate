export interface BranchReview {
  id: number;
  userId: number;
  branchId: number;
  rating: number;     // số sao (1–5)
  comment: string;    // nội dung đánh giá
  approved: boolean;  // duyệt hay chưa
  createdAt: string;
  updatedAt: string;
}

export interface CreateBranchReviewDto {
  userId: number;
  branchId: number;
  rating: number;
  comment: string;
  approved?: boolean; // khách thì mặc định false, admin mới duyệt
}
