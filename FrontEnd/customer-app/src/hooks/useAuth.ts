// src/hooks/useAuth.ts
import { useEffect, useState, useCallback } from "react";
import { loginUser, logoutUser, registerUser, getUserById, updateUser } from "../services/userService";
import { UserRequest, UserResponse } from "../types/User";
import { setWalletId } from "../api/axiosClient"; // ✅ thêm dòng này

export const useAuth = () => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await loginUser(email, password);
      return res;
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: UserRequest) => {
    try {
      setLoading(true);
      setError(null);
      await registerUser(data);
    } catch (err: any) {
      setError(err.message ?? "Register failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  const fetchUser = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const res = await getUserById(id);
      setUser(res.data);

      // ✅ Lưu walletId vào storage cho walletService xài
      if (res.data.walletId) {
        await setWalletId(res.data.walletId);
      }
    } catch (err: any) {
      setError(err.message ?? "Fetch user failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (id: number, data: Partial<UserRequest>) => {
    try {
      setLoading(true);
      const res = await updateUser(id, data);
      setUser(res.data);

      // ✅ Nếu update xong có walletId mới, lưu lại
      if (res.data.walletId) {
        await setWalletId(res.data.walletId);
      }
    } catch (err: any) {
      setError(err.message ?? "Update failed");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    fetchUser,
    updateProfile,
  };
};
