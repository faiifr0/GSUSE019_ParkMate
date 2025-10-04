'use client'
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ParkBranchTable from "@/components/tables/ParkBranchTable";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ParkBranchesList() {
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