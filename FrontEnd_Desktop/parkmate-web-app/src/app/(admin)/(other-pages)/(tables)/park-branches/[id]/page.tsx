"use client"
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import OverviewInfoCard from "@/components/park-branch/OverviewInfoCard";
import EventOverViewTable from "@/components/tables/EventOverviewTable";
import TicketPriceOverViewTable from "@/components/tables/TicketPriceOverviewTable";
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
            <ComponentCard title="Upcoming Event">
              <div>
                <EventOverViewTable></EventOverViewTable>
              </div>
            </ComponentCard>
          </div>
          <div className="col-span-6 space-y-6 xl:col-span-6">
            <ComponentCard title="Ticket Price">
              <div>
              <TicketPriceOverViewTable></TicketPriceOverViewTable>
              </div>
            </ComponentCard>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}