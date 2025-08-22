import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import ParkBranchTable from "@/components/tables/ParkBranchTable";
import React from "react";

export const metadata: Metadata = {
  title: "Park Branches List | ParkMate",
  description:
    "This is Next.js Park Branches List page for ParkMate",
  // other metadata
};

export default function ParkBranchesList() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Park Branches" />
      <div className="space-y-6">
        <ParkBranchTable></ParkBranchTable>
      </div>
    </div>
  );
}