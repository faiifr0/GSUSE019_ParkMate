// src/types/game.ts
export interface BranchGame {
  id: number;
  name: string;
  description?: string;
  image: string;
  price?: number;     // nếu có giá vé
  duration?: string;  // ví dụ: "30 phút"
}
