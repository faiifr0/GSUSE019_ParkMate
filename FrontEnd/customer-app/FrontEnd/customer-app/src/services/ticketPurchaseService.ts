import { walletService } from "./walletService";
import ticketService  from "./ticketService";
import axiosClient from "../api/axiosClient";

export const ticketPurchaseService = {
  purchaseTicket: async (
    walletId: number,
    userId: number,
    ticketId: number,
    quantity: number
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const wallet = await walletService.getWalletById(walletId);
      const ticket = await ticketService.getTicketById(ticketId);
      if (!ticket) return { success: false, message: "Vé không tồn tại" };

      const totalCost = ticket.price * quantity;

      if (wallet.balance < totalCost) {
        return { success: false, message: "Số dư không đủ" };
      }

      await walletService.deduct(walletId, totalCost, `Mua ${quantity} vé ${ticket.name}`);

      await axiosClient.post("/transactions", {
        walletId,
        amount: totalCost,
        type: "purchase",
        description: `Mua ${quantity} vé ${ticket.name}`,
      });

      await ticketService.createUserTicket(userId, ticketId, quantity);

      return { success: true, message: "Mua vé thành công" };
    } catch (err: any) {
      console.error("Lỗi mua vé:", err);
      return { success: false, message: "Có lỗi xảy ra" };
    }
  },
};
