'use client';
import React, { useEffect, useState } from "react";
import { notFound, useParams, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import branchStaffService, { branchStaffResponse } from "@/lib/services/branchStaffService";
import Button from "../ui/button/Button";
import staffAssignmentService, { staffAssignmentResponse } from "@/lib/services/staffAssignementService";
import { enUS, vi } from "date-fns/locale";
import { format, parseISO } from "date-fns";
import toast from "react-hot-toast";
import shiftService, { shiftResponse } from "@/lib/services/shiftService";

// Handle what happens when you click on the pagination
const handlePageChange = (page: number) => {};

export default function StaffOverviewTable() {
  const params = useParams();
  const id = String(params.id);

  const searchParams = useSearchParams();
  const rawDate = searchParams.get('date');
  
  const isValidISODate = (date: string | null): boolean => {
    return !!date && /^\d{4}-\d{2}-\d{2}$/.test(date);
  };
  
  const formattedDate = isValidISODate(rawDate) ? format(parseISO(rawDate!), 'dd/MM/yyyy') : null;
  
  if (!formattedDate || id === null) {
    notFound();
  }
  
  const weekdayEN = format(rawDate!, 'EEEE', { locale: enUS });

  const [staffs, setStaffs] = useState<branchStaffResponse[]>([]);
  const [shifts, setShifts] = useState<shiftResponse[]>([]);  
  const [staffAssignments, setStaffAssignments] = useState<staffAssignmentResponse[]>([]);

  // Fetch Staffs List
  const fetchStaffs = async () => {
    try {
      const response = await branchStaffService.getAll();     
                               
      // Filter Staff Of This Branch and status must be true
      setStaffs(response.filter(staff => staff.status === true && staff.parkBranchId === Number(id) && staff.username != null));
    } catch (err) {
      console.log(err);
    } finally {
      // do something
    }
  }

  // Fetch Staffs List
  const fetchShifts = async () => {
    try {
      const response = await shiftService.getAll();     
                                                                      
      setShifts(response);
    } catch (err) {
      console.log(err);
    } finally {
      // do something
    }
  }

  // Fetch Staff Assignments List
  const fetchStaffAssignments = async () => {
    try {
      const response = await staffAssignmentService.getAll();     
                                                                      
      setStaffAssignments(response);
    } catch (err) {
      console.log(err);
    } finally {
      // do something
    }
  }

  useEffect(() => {    
    fetchStaffs();
    fetchShifts();
    fetchStaffAssignments();
  }, [])

  const handleAssigning = async (staffId: number) => {
    try {
      const matchedShift = shifts.find(s => s.daysOfWeek === weekdayEN);      

      if (matchedShift === null) throw new Error();      

      const assignedShift = {
        staffId,
        shiftId: matchedShift?.id,
        assignedDate: rawDate!,
      };
      
      console.log("assignedShift", assignedShift);

      await staffAssignmentService.createStaffAssignment(assignedShift);                
      const message = 'Phân ca nhân viên thành công!';
      toast.success(message, {
        duration: 3000,
        position: 'top-right',
      }) 
      window.location.reload();
    } catch (err) {
      const message = 'Phân ca nhân viên thất bại!';
      toast.error(message, {
        duration: 3000,
        position: 'top-right',
      });         
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[250px]">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-lg dark:text-gray-400"
                  >
                    No.
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-lg dark:text-gray-400"
                  >
                    Tên
                  </TableCell>  
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-lg dark:text-gray-400"
                  >
                    Vai trò
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-lg dark:text-gray-400"
                  >
                    Mô tả
                  </TableCell>
                  {new Date(rawDate!) >= new Date() && (
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-lg dark:text-gray-400"
                  >
                    Action
                  </TableCell>                         
                  )}            
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {/* Branch staffs are sorted in ascending order by username */}
                {[...staffs]
                  .sort((a, b) => a.username.localeCompare(b.username))
                  .map((staff, index) => (
                  <TableRow key={staff.id}>                  
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {index + 1}
                    </TableCell>                  
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {staff.username} - {staff.userFullName}
                    </TableCell>     
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">                      
                      {staff.role}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">                      
                      {staff.description}
                    </TableCell>                                        
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      <Button 
                        size="sm"
                        disabled={staffAssignments.some(sa => sa.staffName === staff.username)}
                        onClick={() => { handleAssigning(staff.id); }}
                      >
                        Phân ca
                      </Button>
                    </TableCell>                                                  
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>      
      </div>      
    </>
  );
}
