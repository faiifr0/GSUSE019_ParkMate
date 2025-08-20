// src/services/walletService.ts
import api from "./api"; // instance axios có sẵn

import { Wallet, Transaction } from "../types/Wallet";

export const walletService = {
  // Lấy thông tin ví theo id
  getWalletById: async (id: number): Promise<Wallet> => {
    const res = await api.get(`/wallets/${id}`);
    return res.data;
  },

  // Lấy lịch sử giao dịch
  getTransactions: async (id: number): Promise<Transaction[]> => {
    const res = await api.get(`/wallets/${id}/transactions`);
    return res.data;
  },

  // Nạp tiền
  topUp: async (id: number, amount: number, description?: string): Promise<Wallet> => {
    const res = await api.post(`/wallets/${id}/topup`, { amount, description });
    return res.data;
  },

  // Trừ tiền
  deduct: async (id: number, amount: number, description?: string): Promise<Wallet> => {
    const res = await api.post(`/wallets/${id}/deduct`, { amount, description });
    return res.data;
  },

  // (Optional) Rút tiền
  withdraw: async (id: number, amount: number, description?: string): Promise<Wallet> => {
    const res = await api.post(`/wallets/${id}/withdraw`, { amount, description });
    return res.data;
  },
};
