import Calendar from "@/components/calendar/Calendar";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";

export default function StaffShifts() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Staff Shifts" />
      <Calendar />
    </div>
  );
}