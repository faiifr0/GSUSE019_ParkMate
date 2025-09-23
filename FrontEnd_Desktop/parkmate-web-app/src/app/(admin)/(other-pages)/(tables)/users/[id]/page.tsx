//import UserAddressCard from "@/components/user-profile/UserAddressCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UserDetailInfoCard from "@/components/user-detail/UserDetailInfoCard";
import UserDetailMetaCard from "@/components/user-detail/UserDetailMetaCard";
import { Metadata } from "next";
import React from "react";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Thông tin người dùng | ParkMate",
  description:
    "This is Next.js User Info page for ParkMate",
};

export default function Profile() {
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