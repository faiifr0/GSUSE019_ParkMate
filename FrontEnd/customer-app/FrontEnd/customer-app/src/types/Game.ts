export interface Game {
  id: number;           // ID game
  branchId: number;     // ID chi nhánh thuộc về
  name: string;         // Tên game
  description: string;  // Mô tả game
  imageUrl: string;     // Hình đại diện game
  status: boolean;      // Trạng thái active/inactive
}

// API response phân trang
export interface GameResponse {
  content: Game[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}
