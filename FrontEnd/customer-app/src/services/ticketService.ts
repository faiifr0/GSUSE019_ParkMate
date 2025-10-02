// src/services/ticketTypeService.ts
import axiosClient from "../api/axiosClient";
import { Ticket } from "../types/Ticket";

const ticketTypeService = {
  // Lấy tất cả ticket types
  getAll: async (): Promise<Ticket[]> => {
    const res = await axiosClient.get<Ticket[]>("/ticket-types");
    return res.data;
  },

  // Lấy chi tiết 1 ticket type theo id
  getById: async (id: number): Promise<Ticket> => {
    const res = await axiosClient.get<Ticket>(`/ticket-types/${id}`);
    return res.data;
  },

  // Lấy ticket types theo branchId
  getByBranchId: async (branchId: number): Promise<Ticket[]> => {
    const res = await axiosClient.get<Ticket[]>(`/ticket-types/of-branch/${branchId}`);
    return res.data;
  },
};

export default ticketTypeService;
