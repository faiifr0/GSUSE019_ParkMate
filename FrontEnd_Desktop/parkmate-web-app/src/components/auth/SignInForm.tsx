"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import userService from "@/lib/services/userService";
import Cookies from "js-cookie";

export default function SignInForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  
  const [email, setEmail] = useState("admin@local");
  const [password, setPassword] = useState("Admin@1234");

  const handleLogin = async () => {
    try {      
      const response = await userService.login( 
        email, 
        password 
      );      
      
      const token = response?.accessToken;
      if (!token) throw new Error("No token");

      Cookies.set("token", token, {
        expires: 1/24, // expire after 1 hour
        path: "/",
        secure: false, // only over HTTPS
        sameSite: "strict",
      });
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      //something here
    }
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">      
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto mb-8">
        <div>
          <div className="mb-5">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Đăng nhập
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nhập email và mật khẩu của bạn để tiến hành đăng nhập!
            </p>
          </div>
          <div>            
            <form onSubmit = {(e) => {
              e.preventDefault();              
            }}>             
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input 
                    placeholder="info@gmail.com" 
                    type="email" 
                    onChange={(e) => setEmail(e.target.value)}
                    defaultValue="admin@local"
                  >
                    
                  </Input>
                </div>
                <div>
                  <Label>
                    Mật khẩu <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      onChange={(e) => setPassword(e.target.value)}
                      defaultValue="Admin@1234"
                    >
                    </Input>
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                {/* <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div> */}
                <div className="mt-9">
                  <Button 
                    className="w-full" 
                    size="sm"                    
                    onClick={handleLogin}
                  >
                    Đăng nhập
                  </Button>
                </div>
              </div>
            </form>

            {/* <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
