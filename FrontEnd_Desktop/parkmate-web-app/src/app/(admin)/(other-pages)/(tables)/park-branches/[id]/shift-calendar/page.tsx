'use client'
import Calendar from "@/components/calendar/Calendar";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useAuth } from "@/components/context/AuthContext";
import parkBranchService, { parkBranchResponse } from "@/lib/services/parkBranchService";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function ShiftCalendar() {
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
      <PageBreadcrumb pageTitle="Lịch làm việc" items={breadcrumbItems}/>
      <Toaster
        reverseOrder={false}
        toastOptions={{
          style: {
            marginTop: '70px',            
            zIndex: 100000, // cao hơn modal
          },
      }}/>
      <ComponentCard title={"Lịch làm việc của " + branchInfo?.name}>
        <div className="space-y-6">
          <Calendar />
        </div>
      </ComponentCard>      
    </div>
  );
}