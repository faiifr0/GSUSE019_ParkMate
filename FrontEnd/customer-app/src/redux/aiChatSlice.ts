// src/redux/aiChatSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatMessage } from "../types/AIChat";

interface AIChatState {
  messages: ChatMessage[];
}

const initialState: AIChatState = {
  messages: [],
};

const aiChatSlice = createSlice({
  name: "aiChat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    addMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages.push(...action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { addMessage, addMessages, clearMessages } = aiChatSlice.actions;
export default aiChatSlice.reducer;
