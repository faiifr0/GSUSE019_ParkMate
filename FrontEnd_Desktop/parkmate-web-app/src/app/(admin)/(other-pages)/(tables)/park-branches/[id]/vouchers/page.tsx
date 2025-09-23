'use client'
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import parkBranchService, { parkBranchResponse } from "@/lib/services/parkBranchService";
import ParkBranchVoucherTable from "@/components/tables/ParkBranchVoucherTable";
import toast, { Toaster } from "react-hot-toast";

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
      const message = 'Fetch thông tin chung của chi nhánh thất bại!';
      toast.error(message, {
        duration: 3000,
        position: 'top-right',
      });
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
      <PageBreadcrumb pageTitle="Vouchers" items={breadcrumbItems}/>
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
      <ComponentCard title={"Vouchers of " + branchInfo?.name}>
        <div className="space-y-6">
          <ParkBranchVoucherTable></ParkBranchVoucherTable>
        </div>
      </ComponentCard>
    </div>
  );
}