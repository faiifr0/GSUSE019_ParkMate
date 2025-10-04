import axiosClient from "../api/axiosClient";
import { AIChatRequest, AIChatResponse } from "../types/AIChat";

const ENDPOINT = "/ai/chat";

export const aiChatService = {
  sendChat: async (body: AIChatRequest): Promise<AIChatResponse> => {
    const response = await axiosClient.post<AIChatResponse>(ENDPOINT, body);
    return response.data;
  }
};
