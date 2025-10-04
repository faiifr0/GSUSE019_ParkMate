// src/validation/loginValidation.ts
import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  password: Yup.string()
    .min(5, "Mật khẩu phải ít nhất 5 ký tự")
    .required("Vui lòng nhập mật khẩu"),
});
