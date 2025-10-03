// src/services/walletService.ts
import axiosClient from "../api/axiosClient";
import { getWalletId, getUser } from "../api/axiosClient";
import { Wallet } from "../types/Wallet";

/** Wallet Store để notify mọi hook khi balance thay đổi */
type WalletListener = (wallet: Wallet) => void;

class WalletStore {
  private wallet: Wallet | null = null;
  private listeners: WalletListener[] = [];

  /** Subscribe để nhận update wallet */
  subscribe(listener: WalletListener) {
    this.listeners.push(listener);
    if (this.wallet) listener(this.wallet); // gửi ngay nếu có sẵn
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /** Notify tất cả listener */
  private notify() {
    if (this.wallet) {
      this.listeners.forEach((l) => l(this.wallet!));
    }
  }

  /** Lấy wallet từ server và lưu vào store */
  async fetchWallet(id?: number) {
    let walletId = id ?? (await getWalletId());
    let wallet: Wallet | null = null;

    if (walletId) {
      try {
        const res = await axiosClient.get<Wallet>(`/wallets/${walletId}`);
        wallet = res.data;
      } catch (err) {
        console.warn("GET /wallets/:id failed, trying fallback:", err);
      }
    }

    // fallback: lấy theo user
    if (!wallet) {
      const user = await getUser();
      if (user?.id) {
        const listRes = await axiosClient.get<Wallet[]>("/wallets");
        wallet = listRes.data.find((w) => w.userId === user.id) || null;
      }
    }

    if (!wallet) throw new Error("Wallet not found");

    this.wallet = wallet;
    this.notify();
    return wallet;
  }

  /** Cập nhật wallet và notify */
  async updateWallet(id: number, data: Partial<Wallet>) {
    const res = await axiosClient.put<Wallet>(`/wallets/${id}`, data);
    this.wallet = res.data;
    this.notify();
    return res.data;
  }

  /** Wrapper để hook gọi dễ hơn */
  getWalletById(id?: number) {
    return this.fetchWallet(id);
  }

  getCurrentWallet() {
    return this.wallet;
  }
}

export const walletService = new WalletStore();
export default walletService;
