"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import React, { useState } from "react";
import userService from "@/lib/services/userService";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  
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
      window.location.href = "/";
    } catch (error) {
      const message = "Mật khẩu hoặc email không đúng!"
      toast.error(message, {
        duration: 3000,
        position: 'bottom-left',
      });
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

              <Toaster                
                reverseOrder={false}                               
                containerStyle={{                  
                  marginLeft: '13rem',
                  marginBottom: '8rem',
                }}
              />
            </form>            
          </div>
        </div>
      </div>
    </div>
  );
}
