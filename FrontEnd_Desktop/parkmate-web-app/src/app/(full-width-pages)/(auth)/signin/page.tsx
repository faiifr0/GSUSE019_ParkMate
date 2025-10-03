import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng Nhập",
  description: "This is Next.js Signin Page for ParkMate",
};

export default function SignIn() {
  return <SignInForm />;
}