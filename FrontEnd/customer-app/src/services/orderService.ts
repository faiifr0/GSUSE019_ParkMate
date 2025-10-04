import axiosClient from "../api/axiosClient";
import {
  Order,
  CreateOrderPayload,
  UpdateOrderPayload,
} from "../types/Order";

const orderService = {
  getById: async (id: number): Promise<Order> => {
    const { data } = await axiosClient.get(`/orders/${id}`);
    return data;
  },

  getByUserId: async (userId: number): Promise<Order[]> => {
    const { data } = await axiosClient.get(`/orders`, { params: { userId } });
    console.log("Order data from API:", data);
    return data;
  },

  create: async (payload: CreateOrderPayload): Promise<Order> => {
    const { data } = await axiosClient.post(`/tickets`, payload);
    return data;
  },

  update: async (id: number, payload: UpdateOrderPayload): Promise<Order> => {
    const { data } = await axiosClient.put(`/orders/${id}`, payload);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/orders/${id}`);
  },
};

export default orderService;
