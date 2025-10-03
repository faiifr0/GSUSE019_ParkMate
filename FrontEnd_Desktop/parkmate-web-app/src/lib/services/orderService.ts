import axiosClient from "../axiosClient";

export type TicketDetailResponse = {
  ticketTypeId: number;
  ticketTypeName: string;
  ticketDate: string;
  quantity: number;
  price: number;
  discount: number;
  finalPrice: number;
};

export type orderResponse = {
  orderId: number;
  finalAmount: number;
  status: string;
  details: TicketDetailResponse[];
};

const orderService = {
  getOrderById: async (id: string): Promise<orderResponse> => {
    try {
      const res = await axiosClient.get<orderResponse>(`/orders/${id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching ticket order id {" + id + "} : ", error);
      throw error;
    }
  },  

  getOrdersOfUser: async (
    userId: string,     
  ): Promise<orderResponse[]> => {
    try {
      const res = await axiosClient.get<orderResponse[]>(`/orders?userId=${userId}`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching ticker orders of user id {" + userId + "} : ", error);
      throw error;
    }
  },
};

export default orderService;
