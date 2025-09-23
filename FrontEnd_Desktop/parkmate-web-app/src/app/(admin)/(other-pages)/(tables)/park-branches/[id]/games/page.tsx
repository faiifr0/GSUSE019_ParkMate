'use client'
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import parkBranchService, { parkBranchResponse } from "@/lib/services/parkBranchService";
import BranchStaffTable from "@/components/tables/BranchStaffTable";
import { Toaster } from "react-hot-toast";

export default function ParkBranchTicketsList() {
  const params = useParams();
  const id = params.id ? String(params.id) : '0';

  const [branchInfo, setBranchInfo] = useState<parkBranchResponse>();    

  const fetchParkBranch = async () => {
    const response = await parkBranchService.getParkBranchById(id);
    setBranchInfo(response);  
  }

  // Fetch Park Branch Overview Info
    useEffect(() => {
    try {
      fetchParkBranch();  
    } catch (err) {
      console.log(err);
    } finally {
      // do something
    }
  }, [])

  const breadcrumbItems = [
    { name: "Danh sách chi nhánh", path: "/park-branches" },
    { name: "Thông tin chung của chi nhánh", path: "/park-branches/" + id } 
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