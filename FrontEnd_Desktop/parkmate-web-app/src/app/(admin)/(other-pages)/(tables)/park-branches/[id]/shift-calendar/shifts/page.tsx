'use client'
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import parkBranchService, { parkBranchResponse } from "@/lib/services/parkBranchService";
import { useParams, notFound, useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { format, parseISO } from 'date-fns';
import StaffOverviewTable from "@/components/tables/StaffOverviewTable";
import StaffJoinShiftTable from "@/components/tables/StaffJoinShiftTable";
import { vi, enUS } from 'date-fns/locale';
import { Toaster } from "react-hot-toast";
import shiftService, { shiftResponse } from "@/lib/services/shiftService";
import { useAuth } from "@/components/context/AuthContext";

export default function Shifts() {  
  const { currUser } = useAuth();
  const router = useRouter();
  const params = useParams();
  const branchId = params.id ? Number(params.id) : 0;

  const [branchInfo, setBranchInfo] = useState<parkBranchResponse>();    
  const [shifts, setShifts] = useState<shiftResponse[]>([]); 

  const fetchParkBranch = async () => {
    const response = await parkBranchService.getParkBranchById(String(branchId));
    setBranchInfo(response);  
  }

  const fetchShifts = async () => {
    const response = await shiftService.getAll();
    setShifts(response);  
  }

  const searchParams = useSearchParams();
  const rawDate = searchParams.get('date');

  const isValidISODate = (date: string | null): boolean => {
    return !!date && /^\d{4}-\d{2}-\d{2}$/.test(date);
  };

  const formattedDate = isValidISODate(rawDate) ? format(parseISO(rawDate!), 'dd/MM/yyyy') : null;

  if (!formattedDate) {
    notFound();
  }

  const weekdayVN = format(rawDate!, 'EEEE', { locale: vi });
  const weekdayEN = format(rawDate!, 'EEEE', { locale: enUS });

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

  // Fetch Park Branch Overview Info
  useEffect(() => {
    try {
      fetchParkBranch();  
      fetchShifts();
    } catch (err) {
      console.log(err);
      notFound();
    } 
  }, [])

  if (!currUser) return null;

  const isAdmin = currUser?.roles?.includes("ADMIN");
  const isManager = currUser?.roles?.includes("MANAGER");
  const isBranchMatch = branchId !== 0 && currUser?.parkBranchId !== 0 && branchId === currUser?.parkBranchId;

  const isAuthorized = isAdmin || (isManager && isBranchMatch);

  if (!isAuthorized) return null; // prevent rendering before redirect    

  const breadcrumbItems = [
    { name: "Danh sách chi nhánh", path: "/park-branches" },
    { name: "Thông tin chung của chi nhánh", path: "/park-branches/" + branchId },
    { name: "Lịch làm việc", path: "/park-branches/" + branchId + "/shift-calendar"} 
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Ca làm của chi nhánh" items={breadcrumbItems}/>
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
      <ComponentCard title={"Ca làm ngày " + formattedDate + " của " + branchInfo?.name}>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-6 space-y-6">
            <ComponentCard title="Nhân viên chi nhánh">
              <div>                
                <StaffOverviewTable></StaffOverviewTable>
              </div>
            </ComponentCard>
          </div>

          <div className="col-span-6 space-y-6">
            <ComponentCard title={"Ca " + weekdayVN + " ngày " + formattedDate + " (10h-22h)"}>
              <div>
                <StaffJoinShiftTable></StaffJoinShiftTable>
              </div>
            </ComponentCard>
          </div>
        </div>
      </ComponentCard>      
    </div>
  );
}