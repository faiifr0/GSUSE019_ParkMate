import ComponentCard from "@/components/common/ComponentCard";
import NotificationTable from "@/components/tables/NotificationTable";
import React from "react";

export default function NotificationsList() {
  return (
    <div>
      <ComponentCard title="Your Notifications">
        <NotificationTable />
      </ComponentCard>
    </div>      
  );
}