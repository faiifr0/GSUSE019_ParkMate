// src/services/orderService.ts
import axiosClient from "../api/axiosClient";
import {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
} from "../types/Order";

const orderService = {
  // Lấy 1 order theo id
  getById: async (id: number): Promise<Order> => {
    const res = await axiosClient.get<Order>(`/orders/${id}`);
    return res.data;
  },

  // Lấy danh sách order theo userId
  getByUser: async (userId: number): Promise<Order[]> => {
    const res = await axiosClient.get<Order[]>(`/orders`, { params: { userId } });
    return res.data;
  },

  // Tạo order mới
  create: async (data: CreateOrderRequest): Promise<Order> => {
    const res = await axiosClient.post<Order>(`/orders`, data);
    return res.data;
  },

  // Cập nhật order (status, note)
  update: async (id: number, data: UpdateOrderRequest): Promise<Order> => {
    const res = await axiosClient.put<Order>(`/orders/${id}`, data);
    return res.data;
  },

  // Xóa order
  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/orders/${id}`);
  },
};

export default orderService;
