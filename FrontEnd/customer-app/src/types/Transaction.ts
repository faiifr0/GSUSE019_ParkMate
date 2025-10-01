export interface Transaction {
  id: number;
  amount: number;
  type: string; // ví dụ: "topup" | "deduct" | "withdraw" | "purchase"
  walletId: number;
  createdAt: string;
  updatedAt: string;
}
