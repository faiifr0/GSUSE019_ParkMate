import { useState } from "react";
import { registerUser, loginUser } from "../services/userService";
import { UserRequest } from "../types/User";
import { validateRegister } from "../validation/registerValidation";

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

      return {
        success: true,
        data: {
          token,
          userInfo: { username: payload.username, email: payload.email },
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
