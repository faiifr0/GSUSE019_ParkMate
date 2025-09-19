export interface Wallet {
  id: number;
  userId: number;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: number;
  walletId: number;
  amount: number;
  type: "topup" | "deduct" | "withdraw" | "purchase";
  description?: string;
  createdAt: string;
  updatedAt: string;
}