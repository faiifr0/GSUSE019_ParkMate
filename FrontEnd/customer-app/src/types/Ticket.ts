export interface Ticket {
  id: number;
  name: string;
  price: number;
  description: string;
}

export interface UserTicket {
  id: number;
  userId: number;
  ticketId: number;
  quantity: number;
  createdAt: string;
}
