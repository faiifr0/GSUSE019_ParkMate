// src/hooks/useWallet.ts
import { useState, useEffect, useCallback } from "react";
import { walletService } from "../services/walletService";
import { getWalletId } from "../api/axiosClient";

export function useWallet(userId?: number) {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let idToFetch: number | null = null;

      // Nếu có userId truyền vào → lấy wallet theo userId
      if (userId) {
        idToFetch = userId;
      } else {
        // Không có userId → fallback vào walletId lưu trong storage
        const walletId = await getWalletId();
        idToFetch = walletId ? Number(walletId) : null;
      }

      if (!idToFetch) {
        setBalance(0);
        return;
      }

      const wallet = await walletService.getWalletById(idToFetch);
      setBalance(wallet.balance || 0);
    } catch (err: any) {
      console.error("Lỗi lấy số dư ví:", err);
      setError("Không thể lấy số dư");
      setBalance(0);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  return { balance, loading, error, refreshWallet: fetchWallet };
}
