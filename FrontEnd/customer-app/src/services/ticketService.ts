import axiosClient from "../api/axiosClient";
import { Ticket, UserTicket } from "../types/Ticket";


const ticketService = {
  // 👉 Lấy danh sách vé từ backend
  getTickets: async (): Promise<Ticket[]> => {
    const res = await axiosClient.get("/ticket-types");
    return res.data.map((t: any) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      price: t.basePrice, // map sang price cho frontend
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));
  },

  // 👉 Lấy chi tiết 1 vé theo id
  getTicketById: async (ticketId: number): Promise<Ticket> => {
    const res = await axiosClient.get(`/ticket-types/${ticketId}`);
    const t = res.data;
    return {
      id: t.id,
      name: t.name,
      description: t.description,
      price: t.basePrice,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    };
  },

  // 👉 Mua vé (fake, backend chưa có API)
  createUserTicket: async (
    userId: number,
    ticketId: number,
    quantity: number
  ): Promise<UserTicket> => {
    return {
      id: Date.now(),
      userId,
      ticketId,
      quantity,
      createdAt: new Date().toISOString(),
    };
  },

  // 👉 Lấy danh sách vé của user (fake)
  getUserTickets: async (_userId: number): Promise<UserTicket[]> => {
    return [];
  },
};

export default ticketService;