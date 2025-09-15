import axiosClient from "../api/axiosClient";
import { AIChatRequest, AIChatResponse } from "../types/AIChat";

export const sendChat = async (body: AIChatRequest): Promise<AIChatResponse> => {
  const response = await axiosClient.post("/ai/chat", body);
  return response.data;
};
