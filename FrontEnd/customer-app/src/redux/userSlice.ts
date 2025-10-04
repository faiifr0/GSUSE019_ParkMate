import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Platform } from "react-native";
import { UserResponse } from "../types/User";

interface UserState {
  token: string | null;
  userInfo: UserResponse | null;
}

const initialState: UserState = {
  token: null,
  userInfo: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token?: string | null; userInfo?: UserResponse | null }>) => {
      if ("token" in action.payload) state.token = action.payload.token ?? null;
      if ("userInfo" in action.payload && action.payload.userInfo) state.userInfo = action.payload.userInfo;

      if (Platform.OS === "web") {
        if (action.payload.token) localStorage.setItem("token", action.payload.token);
        else if ("token" in action.payload) localStorage.removeItem("token");

        if (action.payload.userInfo) localStorage.setItem("userInfo", JSON.stringify(action.payload.userInfo));
      }
    },

    logout: (state) => {
      state.token = null;
      state.userInfo = null;
      if (Platform.OS === "web") {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("walletId");
        localStorage.removeItem("orderCode");
      }
    },
  },
});

export const { setCredentials, logout } = userSlice.actions;
export default userSlice.reducer;
