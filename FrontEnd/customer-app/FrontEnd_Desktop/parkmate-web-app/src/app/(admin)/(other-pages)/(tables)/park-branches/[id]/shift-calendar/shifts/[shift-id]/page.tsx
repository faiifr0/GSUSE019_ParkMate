'use client'
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useEffect, useRef, useState } from "react";
import { notFound, useParams } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import parkBranchService, { parkBranchResponse } from "@/lib/services/parkBranchService";
import shiftService, { shiftResponse } from "@/lib/services/shiftService";
import staffAssignmentService, { staffAssignmentResponse } from "@/lib/services/staffAssignementService";
import { format, parseISO } from "date-fns";
import { QrFromJson } from "@/components/common/QrFromJson";
import { Toaster } from "react-hot-toast";

type TakeAttendance = {
  id: Number;
  scanType: 'in' | 'out';
};

export default function ShiftTakeAttendance() {
  const params = useParams();
  const id = params.id ? String(params.id) : null;
  const shiftId = params['shift-id'] ? String(params['shift-id']) : null;  

  if (id === null) {
    notFound();
  }

  const [branchInfo, setBranchInfo] = useState<parkBranchResponse>(); 
  const [shifts, setShifts] = useState<shiftResponse[]>([]);   
  const [staffAssignment, setStaffAssignments] = useState<staffAssignmentResponse>();
  const [qrObjects, setQrObjects] = useState<TakeAttendance[]>([]);

  // Fetch Park Branch Overview Info
  const fetchParkBranch = async () => {
    const response = await parkBranchService.getParkBranchById(id);
    setBranchInfo(response);  
  }

  // Fetch all shifts
  const fetchShifts = async () => {
    const response = await shiftService.getAll();
    setShifts(response);  
  }

  // Fetch chosen staff assignment
  const fetchstaffAssignment = async () => {
    const response = await staffAssignmentService.getStaffAssignmentById(shiftId!);
    setStaffAssignments(response);  
  }

  const isValidISODate = (date: string | null): boolean => {
    return !!date && /^\d{4}-\d{2}-\d{2}$/.test(date);
  };

  const formattedDate = isValidISODate(staffAssignment?.assignedDate!) ? format(parseISO(staffAssignment?.assignedDate!), 'dd/MM/yyyy') : null;

  useEffect(() => {
    if (!shiftId) return;
    const fetchAll = async () => {
      try {
        await fetchParkBranch();  
        await fetchShifts();
        await fetchstaffAssignment();

        setQrObjects([
          { id: Number(shiftId), scanType: 'in' },
          { id: Number(shiftId), scanType: 'out' }
        ]);
      } catch (err) {
        console.error(err);
        notFound();
      }
    };
    fetchAll();
  }, [shiftId]);


  const breadcrumbItems = [
    { name: "Danh sách chi nhánh", path: "/park-branches" },
    { name: "Thông tin chung của chi nhánh", path: "/park-branches/" + id } 
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Điểm danh ca làm" items={breadcrumbItems}/>
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
      <ComponentCard title={"Điểm danh ca làm của nhân viên (10h - 22h) ngày " + formattedDate}>
        <div className="grid grid-cols-12 gap-6 mt-8">
          <div className="col-span-6 space-y-6">
            <ComponentCard title="Điểm danh đến">
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> 
                {qrObjects.length > 0 && (
                  <QrFromJson data={qrObjects[0]} />
                )}
              </div>
            </ComponentCard>
          </div>

          <div className="col-span-6 space-y-6">
            <ComponentCard title={"Điểm danh về"}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>   
                {qrObjects.length > 0 && (
                  <QrFromJson data={qrObjects[1]} />
                )}            
              </div>
            </ComponentCard>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}