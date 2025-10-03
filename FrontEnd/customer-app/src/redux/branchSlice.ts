import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import branchService from "../services/branchService";
import { Branch } from "../types/Branch";

// Async thunk để fetch tất cả branch
export const fetchBranches = createAsyncThunk<Branch[]>(
  "branch/fetchAll",
  async () => {
    const data = await branchService.getAll();
    return data;
  }
);

interface BranchState {
  branches: Branch[];
  loading: boolean;
}

const initialState: BranchState = {
  branches: [],
  loading: false,
};

const branchSlice = createSlice({
  name: "branch",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBranches.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchBranches.fulfilled, (state, action) => {
      state.branches = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchBranches.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default branchSlice.reducer;
