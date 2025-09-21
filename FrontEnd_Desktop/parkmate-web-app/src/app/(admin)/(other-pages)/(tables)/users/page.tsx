//import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UserTable from "@/components/tables/UserTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Danh sách người dùng | ParkMate",
  description:
    "This is Next.js User List page for ParkMate",
  // other metadata
};

export default function UsersList() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Users" />
      <div className="space-y-6">        
        <UserTable />
      </div>      
    </div>
  );
}