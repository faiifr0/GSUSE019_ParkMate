// src/hooks/useWallet.ts
import { useState, useEffect, useCallback } from "react";
import { walletService } from "../services/walletService";
import { getWalletId } from "../api/axiosClient";
import { Wallet } from "../types/Wallet";

export function useWallet(walletIdProp?: number) {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let walletId: number | null = null;

      if (walletIdProp) {
        walletId = walletIdProp;
      } else {
        walletId = await getWalletId();
      }

      // ✅ chỉ cần gọi getWalletById, vì service đã lo fallback rồi
      const wallet: Wallet = await walletService.getWalletById(walletId || undefined);

      setBalance(wallet.balance || 0);
    } catch (err: any) {
      console.error("Lỗi lấy số dư ví:", err);
      setError("Không thể lấy số dư");
      setBalance(0);
    } finally {
      setLoading(false);
    }
  }, [walletIdProp]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  return { balance, loading, error, refreshWallet: fetchWallet };
}
