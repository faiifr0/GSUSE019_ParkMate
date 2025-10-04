import axiosClient from "../axiosClient";
import { updateImageModel } from "../model/updateImageModel";
import { gameCreateModel } from "../model/gameCreateModel";
import { gameUpdateModel } from "../model/gameUpdateModel";

export type GameResponse = {
  id: string,
  parkBranchId: string,
  name: string,
  description: string,
  imageUrl: string,
  status: boolean
};

const gameService = {
  getAllOfBranch: async (id: string): 
    Promise<GameResponse[]> => {
    try {
      const res = await axiosClient.get<GameResponse[]>(`/games/of-branch/${id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Error get all branch games: ", error);
      throw error;
    }
  },

  getGameById: async (id: string): Promise<GameResponse> => {
    try {
      const res = await axiosClient.get<GameResponse>(`/games/${id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching branch game id {" + id + "} : ", error);
      throw error;
    }
  },

  createGame: async (model?: gameCreateModel): Promise<GameResponse> => {
    try {
      const res = await axiosClient.post<GameResponse>(`/games`, model);
      return res.data;
    } catch (error) {
      console.error("❌ Error create branch game : ", error);
      throw error;
    }
  },

  updateGame: async (
    id: string, 
    model?: gameUpdateModel
  ): Promise<GameResponse> => {
    try {
      const res = await axiosClient.put<GameResponse>(`/games/${id}`, model);
      return res.data;
    } catch (error) {
      console.error("❌ Error update branch game id {" + id + "} : ", error);
      throw error;
    }
  },

  deleteGame: async (
    id: string,     
  ): Promise<void> => {
    try {
      await axiosClient.delete<void>(`/games/${id}`);      
    } catch (error) {
      console.error("❌ Error delete branch game id {" + id + "} : ", error);
      throw error;
    }
  },

  updateGameImage: async (
    id: string, 
    model?: updateImageModel
  ): Promise<void> => {
    try {
      const res = await axiosClient.put<updateImageModel>(`/games/${id}/image`, model);
    } catch (error) {
      console.error("❌ Error update game image :", error);
      throw error;
    }
  },
};

export default gameService;
