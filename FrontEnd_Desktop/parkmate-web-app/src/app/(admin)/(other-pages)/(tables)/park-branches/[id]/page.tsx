"use client"
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import OverviewInfoCard from "@/components/park-branch/OverviewInfoCard";
import EventOverViewTable from "@/components/tables/EventOverviewTable";
import TicketPriceOverViewTable from "@/components/tables/TicketPriceOverviewTable";
import StaffOverviewTable from "@/components/tables/StaffOverviewTable";
import React from "react";

export default function ParkBranchOverview() {
  return (
    <div>
      <PageBreadcrumb 
        pageTitle="Park Branch Overview" 
        items={[
          { name: "Park Branches", path: "/park-branches" },          
        ]}
      />
      <ComponentCard title="Park Branch Overview Info">
        <div>
          <OverviewInfoCard></OverviewInfoCard>
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-6 space-y-6 xl:col-span-6">
            <ComponentCard title="Current Staffs">
              <div>                
                <StaffOverviewTable></StaffOverviewTable>
              </div>
            </ComponentCard>
          </div>
          <div className="col-span-6 space-y-6 xl:col-span-6">
            <ComponentCard title="Tickets">
              <div>
                <TicketPriceOverViewTable></TicketPriceOverViewTable>
              </div>
            </ComponentCard>
          </div>
        </div>        
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* <div className="col-span-3"></div> */}
          <div className="col-span-8 col-start-3">
            <ComponentCard title="Upcoming Events">
              <div>
                <EventOverViewTable></EventOverViewTable>
              </div>
            </ComponentCard>
          </div>
          {/* <div className="col-span-3"></div> */}
        </div>        
      </ComponentCard>
    </div>
  );
}