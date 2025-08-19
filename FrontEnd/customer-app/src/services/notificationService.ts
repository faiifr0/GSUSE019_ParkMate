import axiosClient from "../api/axiosClient";
import { Notification } from "../types/Notification";

const notificationService = {
  // Lấy tất cả thông báo
  getAll: async (): Promise<Notification[]> => {
    try {
      const res = await axiosClient.get<Notification[]>("/api/notification");
      return res.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  // Lấy chi tiết 1 thông báo theo id
  getById: async (id: number): Promise<Notification> => {
    try {
      const res = await axiosClient.get<Notification>(`/api/notification/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Error fetching notification with id ${id}:`, error);
      throw error;
    }
  },

  // Lọc theo userId (client side)
  getByUserId: async (userId: number): Promise<Notification[]> => {
    try {
      const all = await notificationService.getAll();
      return all.filter((notif) => notif.userId === userId);
    } catch (error) {
      console.error(`Error fetching notifications for userId ${userId}:`, error);
      throw error;
    }
  },
};

export default notificationService;
