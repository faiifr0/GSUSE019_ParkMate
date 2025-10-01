// src/services/ticketTypeService.ts
import axiosClient from "../api/axiosClient";
import { Ticket } from "../types/Ticket";

const ticketTypeService = {
  // Lấy tất cả ticket types
  getAll: async (): Promise<Ticket[]> => {
    try {
      const res = await axiosClient.get<Ticket[]>("/ticket-types");
      return res.data;
    } catch (error) {
      console.error("Error fetching ticket types:", error);
      throw error;
    }
  },

  // Lấy chi tiết 1 ticket type theo id
  getById: async (id: number): Promise<Ticket> => {
    try {
      const res = await axiosClient.get<Ticket>(`/ticket-types/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Error fetching ticket type with id ${id}:`, error);
      throw error;
    }
  },

  // Lấy ticket types theo branchId
  getByBranchId: async (branchId: number): Promise<Ticket[]> => {
    try {
      const res = await axiosClient.get<Ticket[]>(`/ticket-types/of-branch/${branchId}`);
      return res.data;
    } catch (error) {
      console.error(`Error fetching ticket types for branchId ${branchId}:`, error);
      throw error;
    }
  },
};

export default ticketTypeService;
