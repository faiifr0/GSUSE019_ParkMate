import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import ParkBranchTicketTable from "@/components/tables/ParkBranchTicketTable";

export default function ParkBranchTicketsList() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Park Branches"/>
      <div className="space-y-6">
        <ParkBranchTicketTable></ParkBranchTicketTable>
      </div>
    </div>
  );
}