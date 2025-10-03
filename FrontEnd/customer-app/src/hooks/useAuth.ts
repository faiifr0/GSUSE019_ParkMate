// src/hooks/useAuth.ts
import { useState, useCallback } from "react";
import { loginUser, logoutUser, registerUser, getUserById, updateUser } from "../services/userService";
import { UserRequest, UserResponse } from "../types/User";
import { setWalletId, decodeJWT, setUser, setToken, getWalletId } from "../api/axiosClient";
import { walletService } from "../services/walletService";
import { Wallet } from "../types/Wallet";
import { useDispatch } from "react-redux";
import { setCredentials, logout as logoutRedux } from "../redux/userSlice";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuth = () => {
  const [user, setUserState] = useState<UserResponse | null>(null);
  const [wallet, setWalletState] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  /** Fetch user + wallet */
  const fetchUser = useCallback(async (id: number) => {
    const res = await getUserById(id);
    const userData = res.data;
    setUserState(userData);
    await setUser(userData);

    let walletData: Wallet | null = null;
    if (userData.walletId) {
      await setWalletId(userData.walletId);
      walletData = await walletService.getWalletById(userData.walletId);
      setWalletState(walletData);
    }
    return { userData, walletData };
  }, []);

  /** Login */
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await loginUser(email, password);
      const token = res.data?.accessToken;
      if (!token) throw new Error("No token");

      await setToken(token);
      const decoded: any = decodeJWT(token);

      if (decoded?.userId) {
        const { userData, walletData } = await fetchUser(decoded.userId);

        dispatch(setCredentials({ token, userInfo: userData }));

        return { success: true, token, user: userData, wallet: walletData };
      }
      return { success: false, error: "Không tìm thấy userId trong token" };
    } catch (err: any) {
      setError(err.message ?? "Login failed");
      return { success: false, error: err.message ?? "Login failed" };
    } finally {
      setLoading(false);
    }
  }, [fetchUser, dispatch]);

  /** Register */
  const register = useCallback(async (data: UserRequest) => {
    try {
      await registerUser(data);
      return await login(data.email, data.password);
    } catch (err: any) {
      return { success: false, error: err.message ?? "Register failed" };
    }
  }, [login]);

  /** Logout */
  const logout = useCallback(async () => {
    await logoutUser();
    setUserState(null);
    setWalletState(null);
    dispatch(logoutRedux());
  }, [dispatch]);

  /** Update profile */
  const updateProfile = useCallback(async (id: number, data: Partial<UserRequest>) => {
    const res = await updateUser(id, data);
    const updatedUser = res.data;
    setUserState(updatedUser);
    await setUser(updatedUser);
    return updatedUser;
  }, []);

  return { user, wallet, loading, error, login, register, logout, fetchUser, updateProfile };
};
