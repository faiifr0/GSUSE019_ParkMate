"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import userService, { UserResponse } from "@/lib/services/userService";
import { notFound } from "next/navigation";
import { useAuth } from "../context/AuthContext";


export default function UserDetailMetaCard() {
  const { currUser } = useAuth();  

  const [user, setUser] = useState<UserResponse>();  

  // Fetch Current User
  const fetchUser = async () => {    
    try {
      const response = await userService.getUserById(currUser!.userId!.toString());
      setUser(response);
    } catch (err) {
      console.log(err);      
    }
  }

  useEffect(() => {          
    if (!currUser?.userId) return;

    fetchUser();
  }, [currUser])  
  
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <Image
                width={80}
                height={80}
                src={"/images/user/" + (currUser?.roles?.[0] ?? "user-04") + ".jpg"}
                alt="user"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {user?.username}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.roles?.[0]?.roleName}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Thành Phố Hồ Chí Minh, Việt Nam
                </p>
              </div>
            </div>
          </div>          
        </div>
      </div>      
    </>
  );
}
