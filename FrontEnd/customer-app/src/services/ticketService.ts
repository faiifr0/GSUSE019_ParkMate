// services/ticketService.ts
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

let fakeTickets: Ticket[] = [
  { id: 1, name: "Vé người lớn", price: 100000, description: "Vé vào cổng dành cho người lớn (trên 16 tuổi)" },
  { id: 2, name: "Vé trẻ em", price: 50000, description: "Vé vào cổng dành cho trẻ em (dưới 16 tuổi)" },
  { id: 3, name: "Vé combo gia đình", price: 250000, description: "2 người lớn + 2 trẻ em, ưu đãi tiết kiệm" },
  { id: 4, name: "Vé trọn gói trò chơi", price: 300000, description: "Bao gồm tất cả trò chơi trong khu vui chơi" },
];

let userTickets: UserTicket[] = [];

const ticketService = {
  // Lấy danh sách vé
  getTickets: async (): Promise<Ticket[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(fakeTickets), 500));
  },

  // Lấy thông tin vé theo id
  getTicketById: async (ticketId: number): Promise<Ticket | undefined> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(fakeTickets.find((t) => t.id === ticketId)), 300)
    );
  },

  // Mua vé (fake)
  createUserTicket: async (userId: number, ticketId: number, quantity: number): Promise<UserTicket> => {
    return new Promise((resolve) => {
      const ut: UserTicket = {
        id: userTickets.length + 1,
        userId,
        ticketId,
        quantity,
        createdAt: new Date().toISOString(),
      };
      userTickets.push(ut);
      setTimeout(() => resolve(ut), 300);
    });
  },

  // Lấy danh sách vé của user
  getUserTickets: async (userId: number): Promise<UserTicket[]> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(userTickets.filter((ut) => ut.userId === userId)), 300)
    );
  },
};

export default ticketService;
