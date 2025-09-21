'use client'
import Calendar from "@/components/calendar/Calendar";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import parkBranchService, { parkBranchResponse } from "@/lib/services/parkBranchService";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function ShiftCalendar() {
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