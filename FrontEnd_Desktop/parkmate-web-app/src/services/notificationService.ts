import axiosClient from "../lib/axiosClient";

export type notificationResponse = {
  id: string,
  userId: string,
  message: string,
  notificationType: string,
  sentAt: string,
  status: string,
  createdAt: string,
  updatedAt: string
};

const notificationService = {
  getAll: async(): 
    Promise<notificationResponse[]> => {
    try {
      const res = await axiosClient.get<notificationResponse[]>("/notification");
      return res.data;
    } catch (error) {
      console.error("❌ Error get all notification:", error);
      throw error;
    }
  },

  getNotificationById: async (id: string): Promise<notificationResponse> => {
    try {
      const res = await axiosClient.get<notificationResponse>(`/notification/${id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching notification id {" + id + "} :", error);
      throw error;
    }
  },
};

export default notificationService;
