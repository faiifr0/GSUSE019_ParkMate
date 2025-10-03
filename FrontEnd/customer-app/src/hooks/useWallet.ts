// src/hooks/useWallet.ts
import { useState, useEffect, useCallback } from "react";
import { walletService } from "../services/walletService";
import { Wallet } from "../types/Wallet";

export function useWallet(walletIdProp?: number) {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Callback nhận update từ store
  const handleWalletUpdate = (wallet: Wallet) => {
    setBalance(wallet.balance || 0);
  };

  const fetchWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const wallet = await walletService.fetchWallet(walletIdProp);
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

    // ✅ subscribe store để tự cập nhật khi wallet thay đổi
    const unsubscribe = walletService.subscribe(handleWalletUpdate);
    return () => unsubscribe();
  }, [fetchWallet]);

  return { balance, loading, error, refreshWallet: fetchWallet };
}
