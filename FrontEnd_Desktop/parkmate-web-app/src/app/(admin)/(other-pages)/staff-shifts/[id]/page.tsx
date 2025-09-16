import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BranchStaffTable from "@/components/tables/BranchStaffTable";
import StaffShiftTest from "@/components/tables/StaffShiftTest";
import React from "react";

export default function StaffShifts() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Staff Shifts" />

      <ComponentCard title="Staff List">
        <BranchStaffTable></BranchStaffTable>
      </ComponentCard>

      <ComponentCard title="Ca Sáng (8h-15h)">
        <StaffShiftTest></StaffShiftTest>
      </ComponentCard>
      <ComponentCard title="Ca Đêm (15h-22h)">
        <StaffShiftTest></StaffShiftTest>
      </ComponentCard>
    </div>
  );
}