import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  token: string | null;
  userInfo: any | null;
}

const initialState: UserState = {
  token: null,
  userInfo: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string | null; userInfo: any | null }>
    ) => {
      state.token = action.payload.token;
      state.userInfo = action.payload.userInfo;

      // 🔹 Lưu token & userInfo vào localStorage cho web
      if (typeof window !== "undefined") {
        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
        }
        if (action.payload.userInfo) {
          localStorage.setItem("userInfo", JSON.stringify(action.payload.userInfo));
        }
      }
    },
    logout: (state) => {
      state.token = null;
      state.userInfo = null;

      // 🔹 Xoá localStorage khi logout (web)
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("userId");
        localStorage.removeItem("walletId");
      }
    },
  },
});

export const { setCredentials, logout } = userSlice.actions;
export default userSlice.reducer;
