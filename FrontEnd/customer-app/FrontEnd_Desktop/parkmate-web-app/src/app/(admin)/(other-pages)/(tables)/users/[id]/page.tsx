'use client'
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useAuth } from "@/components/context/AuthContext";
import UserDetailInfoCard from "@/components/user-detail/UserDetailInfoCard";
import UserDetailMetaCard from "@/components/user-detail/UserDetailMetaCard";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";

export default function UserDetails() {
  const { currUser } = useAuth();
  const router = useRouter();

  // Authorization
  useEffect(() => {
    if (currUser && !currUser.roles?.includes("ADMIN")) {
      router.replace("/error-403");
    }
  }, [currUser, router]);

  if (!currUser || !currUser.roles?.includes("ADMIN")) {
    return null; // prevent rendering before redirect
  }
  
  const breadcrumbItems = [
    { name: "Danh sách người dùng", path: "/users" },    
  ];

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <PageBreadcrumb pageTitle="Thông tin người dùng" items={breadcrumbItems}/>
        <Toaster
          reverseOrder={false}
          toastOptions={{
            style: {                        
              zIndex: 100000, // higher than modal
            },
          }}
          containerStyle={{
            top: 80, // sets spacing from top for the whole stack
          }}
        />
        <div className="space-y-6">
          <UserDetailMetaCard />
          <UserDetailInfoCard />          
        </div>
      </div>
    </div>
  );
}