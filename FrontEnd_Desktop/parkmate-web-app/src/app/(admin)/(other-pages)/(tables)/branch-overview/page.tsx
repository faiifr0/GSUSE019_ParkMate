import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Park Branch Overview Info | ParkMate",
  description:
    "This is Next.js Park Branch Overview Info page for ParkMate",
  // other metadata
};

export default function BranchOverview() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Park Branch Overview" />
      <div className="space-y-6">
         
      </div>
      <div className="space-y-6">
         
      </div>
    </div>
  );
}