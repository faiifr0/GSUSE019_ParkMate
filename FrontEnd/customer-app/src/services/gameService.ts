import axiosClient from "../api/axiosClient";
import { Game, GameResponse } from "../types/Game";

interface Pageable {
  page?: number;
  size?: number;
  sort?: string[];
}

/**
 * Lấy tất cả game (có phân trang)
 */
export const getGames = async (
  pageable: Pageable = { page: 0, size: 20 }
): Promise<GameResponse> => {
  const response = await axiosClient.get("/games", { params: pageable });
  return response.data;
};

/**
 * Lấy chi tiết game theo id
 */
export const getGameById = async (id: number): Promise<Game> => {
  const response = await axiosClient.get(`/games/${id}`);
  return response.data;
};

/**
 * Lấy tất cả game theo branchId
 */
export const getGamesByBranch = async (branchId: number): Promise<Game[]> => {
  const response = await axiosClient.get(`/games/of-branch/${branchId}`);
  return response.data; // trả về mảng Game
};

/**
 * Lấy các game hot cho web version (top 4 game status=true)
 */
export const getHotGames = async (): Promise<Game[]> => {
  const data = await getGames({ page: 0, size: 100 });
  const activeGames = data.content.filter((g) => g.status);
  return activeGames.slice(0, 4);
};
