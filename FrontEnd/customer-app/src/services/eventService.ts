// eventService.ts
import axiosClient from "../api/axiosClient";
import { Event } from "../types/Event";

// Nếu API trả EventRaw khác gì Event thì khai báo ở đây
// const formatEvent = (e: EventRaw): Event => { ... }

const eventService = {
  // Lấy tất cả sự kiện
  getAll: async (): Promise<Event[]> => {
    const res = await axiosClient.get<Event[]>("/events");
    // Nếu cần xử lý gì thì dùng map(formatEvent)
    return res.data;
  },

  // Lấy sự kiện theo id
  getById: async (id: number): Promise<Event> => {
    const res = await axiosClient.get<Event>(`/events/${id}`);
    return res.data;
  },

  // Lấy sự kiện của 1 chi nhánh
  getOfBranch: async (branchId: number): Promise<Event[]> => {
    const res = await axiosClient.get<Event[]>(`/events/of-branch/${branchId}`);
    return res.data;
  },
};

export default eventService;
