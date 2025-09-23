"use client"
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BranchImageCard from "@/components/park-branch/BranchImageCard";
import GeographicLocation from "@/components/park-branch/GeographicLocation";
import OverviewInfoCard from "@/components/park-branch/OverviewInfoCard";
import React from "react";
import { Toaster } from "react-hot-toast";
import 'trackasia-gl/dist/trackasia-gl.css';

export default function ParkBranchOverview() { 
  return (
    <div>
      <PageBreadcrumb 
        pageTitle="Thông tin chung của chi nhánh" 
        items={[
          { name: "Danh sách chi nhánh", path: "/park-branches" },          
        ]}
      />
      <Toaster
        reverseOrder={false}
        toastOptions={{
          style: {                        
            zIndex: 100000, // cao hơn modal
          },
        }}
        containerStyle={{
          top: 80, // sets spacing from top for the whole stack
        }}
        />
      <ComponentCard title="Thông tin chung của chi nhánh">
        <div>
          <OverviewInfoCard></OverviewInfoCard>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-6 space-y-6">
            <ComponentCard title="Ảnh chi nhánh">
              <div>
                <BranchImageCard></BranchImageCard>                          
              </div>
            </ComponentCard>
          </div>
          <div className="col-span-6 space-y-6">
            <ComponentCard title="Vị trí địa lý">              
                <GeographicLocation></GeographicLocation>                              
            </ComponentCard>
          </div>    
        </div>        
      </ComponentCard>
    </div>
  );
}