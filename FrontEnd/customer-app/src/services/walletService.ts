// src/services/walletService.ts
import axiosClient from "../api/axiosClient";
import { getWalletId } from "../api/axiosClient";
import { Wallet } from "../types/Wallet";

export const walletService = {
  // Lấy ví theo ID (ưu tiên truyền vào, nếu không thì lấy từ storage)
  getWalletById: async (id?: number): Promise<Wallet> => {
    const walletId = id ?? (await getWalletId());
    if (!walletId) throw new Error("Wallet ID not found");

    const res = await axiosClient.get(`/wallets/${walletId}`);
    return res.data;
  },

  // Cập nhật ví (PUT /wallets/{id})
  updateWallet: async (id: number, data: Partial<Wallet>): Promise<Wallet> => {
    const res = await axiosClient.put(`/wallets/${id}`, data);
    return res.data;
  },
};
