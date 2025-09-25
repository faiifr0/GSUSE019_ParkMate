import { UserRequest } from "../types/User";

export const validateRegister = (payload: UserRequest, confirmPassword?: string): string | null => {
  if (!payload.email || !payload.password) {
    return "⚠️ Vui lòng nhập email và mật khẩu";
  }

  if (confirmPassword && payload.password !== confirmPassword) {
    return "❌ Mật khẩu không khớp";
  }

  if (payload.phoneNumber && !/^0[3|5|7|8|9][0-9]{8}$/.test(payload.phoneNumber)) {
    return "⚠️ Số điện thoại không hợp lệ";
  }

  if (payload.dob && new Date(payload.dob) >= new Date()) {
    return "⚠️ Ngày sinh phải trong quá khứ";
  }

  return null; // hợp lệ
};
