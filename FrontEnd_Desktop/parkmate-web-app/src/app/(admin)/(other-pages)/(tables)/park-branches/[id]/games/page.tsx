'use client'
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import parkBranchService, { parkBranchResponse } from "@/lib/services/parkBranchService";
import BranchStaffTable from "@/components/tables/BranchStaffTable";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";

export default function ParkBranchTicketsList() {
  const { currUser } = useAuth();
  const router = useRouter();
  const params = useParams();
  const branchId = params.id ? Number(params.id) : 0;

  const [branchInfo, setBranchInfo] = useState<parkBranchResponse>(); 
  const fetchParkBranch = async () => {
    try {
      const response = await parkBranchService.getParkBranchById(String(branchId));
      setBranchInfo(response);  
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!currUser) return;

    const isAdmin = currUser.roles?.includes("ADMIN");
    const isManager = currUser.roles?.includes("MANAGER");
    const isBranchMatch = branchId !== 0 && currUser.parkBranchId !== 0 && branchId === currUser.parkBranchId;

    const isAuthorized = isAdmin || (isManager && isBranchMatch);

    if (!isAuthorized) {
      router.replace("/error-403");
    }
  }, [currUser, branchId, router]);

  useEffect(() => {
    if (branchId !== 0) {
      fetchParkBranch();
    }
  }, [branchId]);

  if (!currUser) return null;

  const isAdmin = currUser?.roles?.includes("ADMIN");
  const isManager = currUser?.roles?.includes("MANAGER");
  const isBranchMatch = branchId !== 0 && currUser?.parkBranchId !== 0 && branchId === currUser?.parkBranchId;

  const isAuthorized = isAdmin || (isManager && isBranchMatch);

  if (!isAuthorized) {
    return null; // prevent rendering before redirect
  } 

  const breadcrumbItems = [
    { name: "Danh sách chi nhánh", path: "/park-branches" },
    { name: "Thông tin chung của chi nhánh", path: "/park-branches/" + branchId } 
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Các trò chơi của chi nhánh" items={breadcrumbItems}/>
      <Toaster
        reverseOrder={false}
        toastOptions={{
          style: {                        
            zIndex: 100000, // cao hơn modal
          },
        }}
        containerStyle={{
          top: 80, // sets spacing from top for the whole stack
        }}
      />
      <ComponentCard title={"Các trò chơi của " + branchInfo?.name}>
        <div className="space-y-6">
          <BranchStaffTable></BranchStaffTable>
        </div>
      </ComponentCard>
    </div>
  );
}