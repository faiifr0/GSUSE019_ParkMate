import Calendar from "@/components/calendar/Calendar";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";

export default function Shift() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Shift" />
      <Calendar />
    </div>
  );
}