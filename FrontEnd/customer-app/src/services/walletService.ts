import axiosClient from "../api/axiosClient";
import { Wallet, WalletRaw } from "../types/Wallet";

const formatDateTime = (time?: string) => {
  if (!time) return undefined;
  const date = new Date(time);
  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const walletService = {
  getById: async (id: number): Promise<Wallet> => {
    const res = await axiosClient.get<WalletRaw>(`/wallets/${id}`);

    return {
      id: res.data.id,
      balance: res.data.balance,
      userId: res.data.userId,
      createdAt: formatDateTime(res.data.createdAt),
      updatedAt: formatDateTime(res.data.updatedAt),
    } as Wallet;
  },
};

export default walletService;