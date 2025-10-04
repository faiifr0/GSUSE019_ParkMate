// redux/ticketSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ticketTypeService from "../services/ticketService";
import { Ticket } from "../types/Ticket";

export const fetchTickets = createAsyncThunk<Ticket[]>(
  "ticket/fetchAll",
  async () => {
    const data = await ticketTypeService.getAll();
    return data;
  }
);

interface TicketState {
  tickets: Ticket[];
  loading: boolean;
}

const initialState: TicketState = {
  tickets: [],
  loading: false,
};

const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTickets.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTickets.fulfilled, (state, action) => {
      state.tickets = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchTickets.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default ticketSlice.reducer;
