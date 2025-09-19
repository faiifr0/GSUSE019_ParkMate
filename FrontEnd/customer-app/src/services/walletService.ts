import axiosClient from "../api/axiosClient";
import { Wallet, Transaction } from "../types/Wallet";
import { getWalletId, setWalletId } from "../api/axiosClient";

export const walletService = {
  getWalletById: async (id?: number): Promise<Wallet> => {
    const walletId = id ?? (await getWalletId());
    if (!walletId) throw new Error("Wallet ID not found");
    const res = await axiosClient.get(`/wallets/${walletId}`);
    return res.data;
  },

  ensureWallet: async (): Promise<Wallet> => {
    const res = await axiosClient.post(`/wallets`, {}); // backend lấy userId từ token
    const w: Wallet = res.data;
    if (w.id) await setWalletId(w.id);
    return w;
  },

  topUp: async (
    id?: number,
    amount?: number,
    returnUrl?: string,
    cancelUrl?: string
  ): Promise<{ checkoutUrl: string; paymentLinkId: string }> => {
    const walletId = id ?? (await getWalletId());
    if (!walletId) throw new Error("Wallet ID not found");
    if (!amount || amount <= 0) throw new Error("Amount invalid");

    const res = await axiosClient.post(
      `/wallets/${walletId}/topups`,
      { amount },
      {
        headers: {
          "X-Return-Url": returnUrl || "myapp://success",
          "X-Cancel-Url": cancelUrl || "myapp://cancel",
        },
      }
    );

    return res.data;
  },

  deduct: async (id?: number, amount?: number, description?: string): Promise<Wallet> => {
    const walletId = id ?? (await getWalletId());
    if (!walletId) throw new Error("Wallet ID not found");
    const res = await axiosClient.post(`/wallets/${walletId}/deduct`, { amount, description });
    return res.data;
  },

  getTransactions: async (walletId?: number): Promise<Transaction[]> => {
    const wId = walletId ?? (await getWalletId());
    if (!wId) throw new Error("Wallet ID not found");
    const res = await axiosClient.get(`/transactions?walletId=${wId}`);
    return res.data;
  },
};
