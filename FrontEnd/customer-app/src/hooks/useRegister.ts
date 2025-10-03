import { useState } from "react";
import { registerUser, loginUser, getUserById } from "../services/userService";
import { UserRequest, UserResponse } from "../types/User";
import { validateRegister } from "../validation/registerValidation";
import { decodeJWT, setToken } from "../api/axiosClient";

export function useRegister() {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (payload: UserRequest, confirmPassword?: string) => {
    const errorMsg = validateRegister(payload, confirmPassword);
    if (errorMsg) {
      return { success: false, errors: [errorMsg] };
    }

    try {
      setLoading(true);

      // 1️⃣ Gọi API register
      await registerUser(payload);

      // 2️⃣ Auto-login để lấy token
      const loginRes = await loginUser(payload.email, payload.password);
      const token = loginRes.data?.accessToken || null;
      if (!token) throw new Error("Không lấy được token");

      await setToken(token);
      const decoded: any = decodeJWT(token);

      // 3️⃣ Lấy thông tin user từ API (full UserResponse)
      let userInfo: UserResponse | null = null;
      if (decoded?.userId) {
        const res = await getUserById(decoded.userId);
        userInfo = res.data as UserResponse;
      }

      return {
        success: true,
        data: {
          token,
          userInfo,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        errors: error.response?.data?.errors || ["Đăng ký thất bại"],
      };
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, loading };
}
