//import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ParkBranchTable from "@/components/tables/ParkBranchTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Park Branches | ParkMate",
  description:
    "This is Next.js Park Branches List page for ParkMate",
  // other metadata
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Park Branches" />
      <div className="space-y-6">
        {/* <ComponentCard title="Users"> */}
          <ParkBranchTable />
        {/* </ComponentCard> */}
      </div>
    </div>
  );
}