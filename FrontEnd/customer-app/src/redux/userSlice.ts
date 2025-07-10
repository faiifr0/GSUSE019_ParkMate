// redux/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    token: string | null;
    userInfo: any;
}

const initialState: UserState = {
    token: null,
    userInfo: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ token: string; userInfo: any }>) => {
            state.token = action.payload.token;
            state.userInfo = action.payload.userInfo;
        },
        logout: (state) => {
            state.token = null;
            state.userInfo = null;
        },
    },
});

export const { setCredentials, logout } = userSlice.actions;
export default userSlice.reducer;
