'use client'
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useAuth } from "@/components/context/AuthContext";
import UserTable from "@/components/tables/UserTable";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";

export default function UsersList() {
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

  return (
    <div>
      <PageBreadcrumb pageTitle="Danh sách người dùng" />
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
        <UserTable />
      </div>      
    </div>
  );
}