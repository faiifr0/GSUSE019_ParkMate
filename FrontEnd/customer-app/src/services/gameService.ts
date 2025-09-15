import axiosClient from "../api/axiosClient";
import { Game } from "../types/Game";

interface Pageable {
  page: number;
  size: number;
  sort?: string[];
}

interface GameResponse {
  content: Game[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

/**
 * Lấy tất cả game trong hệ thống (có phân trang)
 */
export const getGames = async (
  pageable: Pageable = { page: 0, size: 20 }
): Promise<GameResponse> => {
  const params = {
    page: pageable.page,
    size: pageable.size,
    sort: pageable.sort,
  };
  const response = await axiosClient.get("/games", { params });
  return response.data;
};

/**
 * Lấy danh sách game theo branchId
 * (lọc client-side vì API backend chưa hỗ trợ trực tiếp)
 */
export const getGamesByBranch = async (branchId: number): Promise<Game[]> => {
  const allGames = await getGames({ page: 0, size: 100 });
  return allGames.content.filter((game) => game.branchId === branchId);
};
