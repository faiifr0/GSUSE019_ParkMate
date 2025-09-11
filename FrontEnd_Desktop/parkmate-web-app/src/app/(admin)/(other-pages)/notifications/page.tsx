import ComponentCard from "@/components/common/ComponentCard";
import UserTable from "@/components/tables/UserTable";
import React from "react";

export default function NotificationsList() {
  return (
    <div>
      <ComponentCard title="Your Notifications">
        <UserTable />
      </ComponentCard>
    </div>      
  );
}