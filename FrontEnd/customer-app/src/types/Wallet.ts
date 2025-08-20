// src/types/wallet.ts
export interface Wallet {
  id: number;
  balance: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: number;
  walletId: number;
  amount: number;
  type: "TOPUP" | "PURCHASE" | "REFUND" | "BONUS";
  description: string;
  createdAt: string;
}
