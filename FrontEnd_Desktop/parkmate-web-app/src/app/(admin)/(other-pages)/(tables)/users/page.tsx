//import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UserTable from "@/components/tables/UserTable";
//import Pagination from "@/components/tables/Pagination";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Users | ParkMate",
  description:
    "This is Next.js User List page for ParkMate",
  // other metadata
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Users" />
      <div className="space-y-6">
        {/* <ComponentCard title="Users"> */}
          <UserTable />
        {/* </ComponentCard> */}
      </div>      
    </div>
  );
}