export interface Ticket {
  id: number;
  name: string;
  description: string;
  price: number; // map từ basePrice của backend
  createdAt: string;
  updatedAt: string;
}

// Interface vé mà user đã mua (tạm fake vì backend chưa có API cho user tickets)
export interface UserTicket {
  id: number;
  userId: number;
  ticketId: number;
  quantity: number;
  createdAt: string;
}