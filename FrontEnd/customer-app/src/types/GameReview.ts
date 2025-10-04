// src/types/GameReview.ts

export interface GameReview {
  id: number;
  gameId: number;
  userId: number;
  rating: number;       // điểm đánh giá (1-5)
  comment: string;      // nội dung bình luận
  approved: boolean;    // đã được duyệt hay chưa
  createdAt: string;    // ngày tạo
}

// Dữ liệu khi gửi POST tạo review mới
export interface GameReviewRequest {
  gameId: number;
  rating: number;
  comment: string;
}

// Response dạng phân trang từ API GET /by-game/{gameId}
export interface GameReviewResponse {
  content: GameReview[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
