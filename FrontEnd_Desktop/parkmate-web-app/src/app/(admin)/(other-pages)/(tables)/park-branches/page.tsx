import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import ParkBranchTable from "@/components/tables/ParkBranchTable";
import React from "react";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Danh sách chi nhánh | ParkMate",
  description:
    "This is Next.js Park Branches List page for ParkMate",
  // other metadata
};

export default function ParkBranchesList() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Danh sách chi nhánh"/>
      <Toaster 
        reverseOrder={false}
        toastOptions={{
          style: {                       
            zIndex: 100000, // cao hơn modal
          }
        }}
        containerStyle={{
          top: 80, // sets spacing from top for the whole stack
        }}
      />
      <div className="space-y-6">
        <ParkBranchTable></ParkBranchTable>
      </div>
    </div>
  );
}