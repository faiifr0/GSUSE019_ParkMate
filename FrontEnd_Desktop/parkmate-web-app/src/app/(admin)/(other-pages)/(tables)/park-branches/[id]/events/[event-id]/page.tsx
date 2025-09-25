'use client'
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import parkBranchService, { parkBranchResponse } from "@/lib/services/parkBranchService";
import eventService, { EventResponse } from "@/lib/services/eventService";
import EventImageCard from "@/components/park-branch/event/EventImageCard";

export default function AmenityImage() {
  const { currUser } = useAuth();
  const router = useRouter();
  const params = useParams();
  const branchId = params.id ? Number(params.id) : 0;
  const eventId = params['event-id'] ? String(params['event-id']) : null;    

  const [branchInfo, setBranchInfo] = useState<parkBranchResponse>(); 
  const [eventInfo, setEventInfo] = useState<EventResponse>();

  const fetchParkBranch = async () => {
    try {
      const response = await parkBranchService.getParkBranchById(String(branchId));
      setBranchInfo(response);  
    } catch (err) {
      console.log(err);
    }
  };

  const fetchEvent = async () => {
    try {
      const response = await eventService.getEventById(eventId!);
      setEventInfo(response);  
    } catch (err) {
      console.log(err);
      notFound();
    }
  };

  useEffect(() => {
    if (!currUser) return;

    const isAdmin = currUser.roles?.includes("ADMIN");
    const isManager = currUser.roles?.includes("MANAGER");
    const isBranchMatch = branchId !== 0 && currUser.parkBranchId !== 0 && branchId === currUser.parkBranchId;

    const isAuthorized = isAdmin || (isManager && isBranchMatch);

    if (!isAuthorized) {
      router.replace("/error-403");
    }
  }, [currUser, branchId, router]);

  useEffect(() => {
    if (branchId !== 0) {
      fetchParkBranch();
    }    
  }, [branchId]);

  useEffect(() => {
    fetchEvent();    
  }, [eventId]);

  if (!currUser) return null;

  const isAdmin = currUser?.roles?.includes("ADMIN");
  const isManager = currUser?.roles?.includes("MANAGER");
  const isBranchMatch = branchId !== 0 && currUser?.parkBranchId !== 0 && branchId === currUser?.parkBranchId;

  const isAuthorized = isAdmin || (isManager && isBranchMatch);

  if (!isAuthorized) {
    return null; // prevent rendering before redirect
  }
  
  if (eventId === null) {
    notFound();
  }

  const breadcrumbItems = currUser.roles.includes("MANAGER")
  ? []
  : [
      { name: "Danh sách chi nhánh", path: "/park-branches" },
      { name: "Thông tin chung của chi nhánh", path: "/park-branches/" + branchId },
      { name: "Các tiện nghi của chi nhánh", path: "/park-branches/" + branchId + "/events"}
    ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Ảnh của tiện nghi" items={breadcrumbItems}/>
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
      <ComponentCard title={"Ảnh của sự kiện " + eventInfo?.name + " của " + branchInfo?.name}>
        <div className="space-y-6">
          <EventImageCard></EventImageCard>
        </div>
      </ComponentCard>
    </div>
  );
}