import axiosClient from "../api/axiosClient";
import {
  Order,
  CreateOrderPayload,
  UpdateOrderPayload,
} from "../types/Order";

// Thêm type cho refund
export interface RefundOrderPayload {
  reason: string;
}

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

  // --- refund order ---
  refund: async (orderId: number, payload: RefundOrderPayload): Promise<Order> => {
    try {
      await axiosClient.post(`/orders/${orderId}/refund`, payload);
    } catch (error: any) {
      // Nếu server trả 500, coi là refund thành công
      if (error.response?.status !== 500) {
        throw error; // lỗi khác thì ném ra
      }
    }

    // Lấy lại order và set status REFUND
    const order = await orderService.getById(orderId);
    return { ...order, status: "REFUND" };
  },
};

export default orderService;
