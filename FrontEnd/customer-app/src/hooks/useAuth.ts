import { useState, useCallback } from "react";
import {
  loginUser,
  logoutUser,
  registerUser,
  getUserById,
  updateUser,
} from "../services/userService";
import { UserRequest, UserResponse } from "../types/User";
import {
  setWalletId,
  decodeJWT,
  setUser,
  setToken,
  getWalletId,
} from "../api/axiosClient";
import { walletService } from "../services/walletService";
import { Wallet } from "../types/Wallet";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuth = () => {
  const [user, setUserState] = useState<UserResponse | null>(null);
  const [wallet, setWalletState] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Lấy user + wallet */
  const fetchUser = useCallback(async (id: number) => {
    try {
      const res = await getUserById(id);
      const userData = res.data;

      setUserState(userData);
      await setUser(userData);

      let walletData: Wallet | null = null;

      if (userData.walletId) {        
        await setWalletId(userData.walletId);            
        try {
          walletData = await walletService.getWalletById(userData.walletId);
          setWalletState(walletData);
        } catch {
          setWalletState(null);
        }
      } else {
        const savedWalletId = await getWalletId();
        if (savedWalletId) {
          try {
            walletData = await walletService.getWalletById(savedWalletId);
            setWalletState(walletData);
          } catch {
            setWalletState(null);
          }
        }
      }

      return { userData, walletData };
    } catch (err) {
      console.error("fetchUser error:", err);
      throw err;
    }
  }, []);

  /** Lưu token */
  const persistTokenLocally = async (rawToken: string) => {
    if (Platform.OS === "web") localStorage.setItem("token", rawToken);
    else await AsyncStorage.setItem("token", rawToken);
    await setToken(rawToken);
  };

  /** Login */
  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await loginUser(email, password);
        const token = res.data?.accessToken;
        if (!token) throw new Error("No token from login");

        await persistTokenLocally(token);

        const decoded: any = decodeJWT(token);
        if (decoded?.userId) {
          const { userData, walletData } = await fetchUser(decoded.userId);

          return {
            success: true,
            token,
            user: userData,
            wallet: walletData,
          } as const;
        }

        return {
          success: false,
          error: "Không tìm thấy userId trong token",
          token,
        } as const;
      } catch (err: any) {
        console.error("login error:", err);
        setError(err.message ?? "Login failed");
        return {
          success: false,
          error: err.message ?? "Login failed",
        } as const;
      } finally {
        setLoading(false);
      }
    },
    [fetchUser]
  );

  /** Register */
  const register = useCallback(
    async (data: UserRequest) => {
      setLoading(true);
      setError(null);
      try {
        await registerUser(data);
        return await login(data.email, data.password);
      } catch (err: any) {
        console.error("register error:", err);
        setError(err.message ?? "Register failed");
        return {
          success: false,
          error: err.message ?? "Register failed",
        } as const;
      } finally {
        setLoading(false);
      }
    },
    [login]
  );

  /** Logout */
  const logout = useCallback(async () => {
    await logoutUser();
    setUserState(null);
    setWalletState(null);
  }, []);

  /** Update profile */
  const updateProfile = useCallback(
    async (id: number, data: Partial<UserRequest>) => {
      setLoading(true);
      setError(null);
      try {
        const res = await updateUser(id, data);
        const updatedUser = res.data;
        setUserState(updatedUser);
        await setUser(updatedUser);
        return updatedUser;
      } catch (err: any) {
        console.error("updateProfile error:", err);
        setError(err.message ?? "Update failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    user,
    wallet,
    loading,
    error,
    login,
    register,
    logout,
    fetchUser,
    updateProfile,
  };
};
