import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    isLoggedIn: boolean;
    token: string | null;
    userInfo: any;
}

const initialState: UserState = {
    isLoggedIn: false,
    token: null,
    userInfo: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login(state, action: PayloadAction<{ token: string; userInfo: any }>) {
            state.isLoggedIn = true;
            state.token = action.payload.token;
            state.userInfo = action.payload.userInfo;
        },
        logout(state) {
            state.isLoggedIn = false;
            state.token = null;
            state.userInfo = null;
        },
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
