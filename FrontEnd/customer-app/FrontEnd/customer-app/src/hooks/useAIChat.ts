// src/hooks/useAIChat.ts
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { addMessages } from "../redux/aiChatSlice";
import { aiChatService } from "../services/aiChatService";
import { ChatMessage, AIChatRequest } from "../types/AIChat";

export const useAIChat = () => {
  const messages = useSelector((state: RootState) => state.aiChat.messages);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (prompt: string) => {
    if (!prompt.trim()) return;

    setLoading(true);
    const userMessage: ChatMessage = { type: "user", text: prompt };
    dispatch(addMessages([userMessage]));

    const history = messages.filter(m => m.type === "user").map(m => m.text);
    const body: AIChatRequest = { prompt, history };

    try {
      const res = await aiChatService.sendChat(body);
      const aiMessage: ChatMessage = { type: "ai", text: res.answer };
      dispatch(addMessages([aiMessage]));
    } finally {
      setLoading(false);
    }
  }, [dispatch, messages]);

  return { messages, sendMessage, loading };
};
