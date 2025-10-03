import { useState, useCallback } from "react";
import { loginUser, logoutUser, registerUser, getUserById, updateUser } from "../services/userService";
import { UserRequest, UserResponse } from "../types/User";
import { setWalletId, decodeJWT, setToken } from "../api/axiosClient";
import { walletService } from "../services/walletService";
import { Wallet } from "../types/Wallet";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, logout as logoutRedux } from "../redux/userSlice";
import { RootState } from "../redux/store";

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.userInfo);
  const [wallet, setWalletState] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Fetch user + wallet */
  const fetchUser = useCallback(async (id: number) => {
    const res = await getUserById(id);
    const userData: UserResponse = res.data;

    let walletData: Wallet | null = null;
    if (userData.walletId) {
      await setWalletId(userData.walletId);
      walletData = await walletService.getWalletById(userData.walletId);
      console.log("[useAuth] Fetched Wallet: ", walletData);
      setWalletState(walletData);
    }

    // ✅ dispatch userInfo
    dispatch(setCredentials({ token: null, userInfo: userData }));
    return { userData, walletData };
  }, [dispatch]);

  /** Login */
  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{
      success: boolean;
      token: string | null;
      user: UserResponse | null;
      wallet?: Wallet | null;
      error?: string;
    }> => {
      setLoading(true);
      try {
        const res = await loginUser(email, password);
        const token: string | null = res.data?.accessToken ?? null;
        if (!token) throw new Error("No token");

        await setToken(token);
        const decoded: any = decodeJWT(token);

        if (decoded?.userId) {
          const { userData, walletData } = await fetchUser(decoded.userId);

          // ✅ dispatch token + user
          dispatch(setCredentials({ token, userInfo: userData }));

          return { success: true, token, user: userData, wallet: walletData };
        }

        return { success: false, token: null, user: null, error: "Không tìm thấy userId trong token" };
      } catch (err: any) {
        setError(err.message ?? "Login failed");
        return { success: false, token: null, user: null, error: err.message ?? "Login failed" };
      } finally {
        setLoading(false);
      }
    },
    [fetchUser, dispatch]
  );

  /** Register */
  const register = useCallback(
    async (data: UserRequest) => {
      try {
        await registerUser(data);
        return await login(data.email, data.password);
      } catch (err: any) {
        return { success: false, token: null, user: null, error: err.message ?? "Register failed" };
      }
    },
    [login]
  );

  /** Logout */
  const logout = useCallback(async () => {
    await logoutUser();
    setWalletState(null);
    dispatch(logoutRedux());
  }, [dispatch]);

  /** Update profile */
  const updateProfile = useCallback(async (id: number, data: Partial<UserRequest>) => {
    const res = await updateUser(id, data);
    const updatedUser = res.data;

    dispatch(setCredentials({ token: null, userInfo: updatedUser }));
    return updatedUser;
  }, [dispatch]);

  return { user, wallet, loading, error, login, register, logout, fetchUser, updateProfile };
};

