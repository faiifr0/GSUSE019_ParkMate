// src/services/gameReviewService.ts
import axiosClient from "../api/axiosClient";
import { GameReview, GameReviewRequest, GameReviewResponse } from "../types/GameReview";

export const gameReviewService = {
  // 🟢 Lấy danh sách review của 1 game (phân trang)
  async getOfGame(gameId: number, page = 0, size = 10): Promise<GameReview[]> {
    const res = await axiosClient.get<GameReviewResponse>(
      `/api/game-reviews/by-game/${gameId}`,
      { params: { page, size } }
    );
    return res.data.content || [];
  },

  // 🟢 Tạo review mới
  async create(payload: GameReviewRequest): Promise<GameReview> {
    const res = await axiosClient.post<GameReview>("/api/game-reviews", payload);
    return res.data;
  },
};
