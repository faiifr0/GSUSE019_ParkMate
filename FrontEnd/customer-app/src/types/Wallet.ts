export interface Wallet {
  id: number;
  balance: number;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

// Dữ liệu raw từ API
export interface WalletRaw {
  id: number;
  balance: number;
  userId: number;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}