import { useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";
import { getDistance } from "geolib";

import { Branch } from "../types/Branch";
import { Voucher } from "../types/Voucher";
import { Game } from "../types/Game";

import branchService from "../services/branchService";
import voucherService from "../services/voucherService";
import { walletService } from "../services/walletService";
import { getHotGames } from "../services/gameService";
import { getWalletId } from "../api/axiosClient";
import { aiChatService } from "../services/aiChatService"; // mới
import { ChatMessage } from "../types/AIChat";

export const useHomeData = (userId?: number) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [nearestBranch, setNearestBranch] = useState<Branch | null>(null);
  const [promotions, setPromotions] = useState<(Voucher & { imageUrl: string; description: string; discount: number })[]>([]);
  const [hotGames, setHotGames] = useState<Game[]>([]);
  const [coin, setCoin] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ----- AI Chat -----
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const sendAIMessage = useCallback(async (prompt: string) => {
    setChatLoading(true);
    try {
      const history = chatMessages.filter(m => m.type === "user").map(m => m.text);
      const res = await aiChatService.sendChat({ prompt, history });
      setChatMessages(prev => [
        ...prev,
        { type: "user", text: prompt },
        { type: "ai", text: res.answer },
      ]);
    } finally {
      setChatLoading(false);
    }
  }, [chatMessages]);

  // ----- Wallet -----
  const fetchWallet = useCallback(async () => {
    try {
      if (!userId) return setCoin(0);
      const walletIdStr = await getWalletId();
      if (!walletIdStr) return setCoin(0);

      const walletId = parseInt(walletIdStr, 10);
      const wallet = await walletService.getWalletById(walletId);
      setCoin(wallet.balance ?? 0);
    } catch (err) {
      console.error("Lỗi khi lấy số dư ví:", err);
      setCoin(0);
    }
  }, [userId]);

  // ----- Branch & Voucher -----
  const fetchBranches = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      let userCoords: { latitude: number; longitude: number } | null = null;
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        userCoords = { latitude: location.coords.latitude, longitude: location.coords.longitude };
      }

      const branchList = await branchService.getAll();
      setBranches(branchList);

      let closest: Branch | null = null;
      let minDistance = Infinity;
      if (userCoords) {
        for (const b of branchList) {
          if (typeof b.lat !== "number" || typeof b.lon !== "number") continue;
          const dist = getDistance(userCoords, { latitude: b.lat, longitude: b.lon });
          if (dist < minDistance) {
            minDistance = dist;
            closest = b;
          }
        }
      }
      setNearestBranch(closest);

      if (closest) {
        const vouchers = await voucherService.getByBranchId(closest.id);
        const validVouchers = vouchers.filter(voucherService.isValidNow);
        setPromotions(
          validVouchers.map(v => ({
            ...v,
            imageUrl: "https://via.placeholder.com/600x200",
            description: `Voucher ${v.code} - Giảm ${Math.round(v.percent * 100)}%`,
            discount: Math.round(v.percent * 100),
          }))
        );
      } else {
        setPromotions([]);
      }

      const games = await getHotGames();
      setHotGames(games);

      if (!userCoords) setError("⚠️ Vị trí không được cấp phép. Chỉ hiển thị chi nhánh và voucher.");
    } catch (err: any) {
      setError(err?.message ?? "Có lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWallet();
    fetchBranches();
  };

  useEffect(() => {
    fetchWallet();
    fetchBranches();
  }, [fetchWallet, fetchBranches]);

  return {
    branches,
    nearestBranch,
    promotions,
    hotGames,
    coin,
    loading,
    refreshing,
    error,
    onRefresh,
    chatMessages,    // AI messages
    chatLoading,
    sendAIMessage,   // function gửi message
  };
};
