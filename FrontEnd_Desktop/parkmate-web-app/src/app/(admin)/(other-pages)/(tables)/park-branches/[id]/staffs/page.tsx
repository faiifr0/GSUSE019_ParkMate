'use client'
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useEffect, useState } from "react";
import ParkBranchTicketTable from "@/components/tables/ParkBranchTicketTable";
import { useParams } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import parkBranchService, { parkBranchResponse } from "@/services/parkBranchService";

export default function ParkBranchTicketsList() {
  const params = useParams();
  const id = params.id ? String(params.id) : '0';

  const [branchInfo, setBranchInfo] = useState<parkBranchResponse>();  
  const [error, setError] = useState<string | null>(null);

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
    { name: "Park Branches", path: "/park-branches" },
    { name: "Park Branch Overview", path: "/park-branches/" + id } 
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Staffs" items={breadcrumbItems}/>
      <ComponentCard title={"Staffs of " + branchInfo?.name}>
        <div className="space-y-6">
          <ParkBranchTicketTable></ParkBranchTicketTable>
        </div>
      </ComponentCard>
    </div>
  );
}