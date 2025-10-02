// src/services/walletService.ts
import axiosClient from "../api/axiosClient";
import { getWalletId, getUser } from "../api/axiosClient";
import { Wallet } from "../types/Wallet";

export const walletService = {
  // Lấy ví theo id (id là walletId). Nếu id undefined => dùng storage.getWalletId()
  getWalletById: async (id?: number): Promise<Wallet> => {
    const walletId = id ?? (await getWalletId());
    if (walletId) {
      try {
        const res = await axiosClient.get<Wallet>(`/wallets/${walletId}`);
        return res.data;
      } catch (err) {
        console.warn("GET /wallets/:id failed, will try fallback list:", err);
        // fallback tiếp xuống tìm theo user
      }
    }

    // fallback: lấy user từ storage, gọi GET /wallets (list) và tìm wallet.userId === user.id
    const user = await getUser();
    if (user?.id) {
      const listRes = await axiosClient.get<Wallet[]>("/wallets");
      const found = listRes.data.find((w) => w.userId === user.id);
      if (found) return found;
    }

    throw new Error("Wallet not found");
  },

  updateWallet: async (id: number, data: Partial<Wallet>): Promise<Wallet> => {
    const res = await axiosClient.put<Wallet>(`/wallets/${id}`, data);
    return res.data;
  },
};

export default walletService;
