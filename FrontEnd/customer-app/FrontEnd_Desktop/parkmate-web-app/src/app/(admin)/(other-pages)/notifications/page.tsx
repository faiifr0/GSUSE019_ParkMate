import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import NotificationTable from "@/components/tables/NotificationTable";
import React from "react";
import { Toaster } from "react-hot-toast";

export default function NotificationsList() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Thông báo của bạn"/>
      <Toaster 
        reverseOrder={false}
        toastOptions={{
          style: {                       
            zIndex: 100000, // cao hơn modal
          }
        }}
        containerStyle={{
          top: 80, // sets spacing from top for the whole stack
        }}
      />
      <ComponentCard title="Thông báo của bạn">
        <NotificationTable />
      </ComponentCard>
    </div>      
  );
}