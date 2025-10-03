'use client';
import React, { useEffect, useState } from "react";
import { notFound, useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import branchStaffService, { branchStaffResponse } from "@/lib/services/branchStaffService";
import staffAssignmentService, { staffAssignmentResponse } from "@/lib/services/staffAssignementService";
import toast from "react-hot-toast";
import Button from "../ui/button/Button";
import { format, parseISO } from 'date-fns';

// Handle what happens when you click on the pagination
const handlePageChange = (page: number) => {};

export default function StaffJoinShiftTable() {
  const router = useRouter();

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

  const [staffs, setStaffs] = useState<branchStaffResponse[]>([]);
  const [staffAssignments, setStaffAssignments] = useState<staffAssignmentResponse[]>([]);

  // Fetch Staffs List
  const fetchStaffs = async () => {
    try {
      const response = await branchStaffService.getAll();                                                                   
      setStaffs(response.filter(s => s.parkBranchId === Number(id)));      
    } catch (err) {
      console.log(err);
      const message = 'Fetch nhân viên thất bại!';
      toast.error(message, {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      // do something
    }
  }
  
  const fetchStaffAssignments = async () => {
    try {
      const response = await branchStaffService.getAll();                                                                   
      const branchStaffs = response.filter(s => s.parkBranchId === Number(id));
      const staffIds = branchStaffs.map(s => s.id);

      const res = await staffAssignmentService.getAll();                                                                  
      setStaffAssignments(res.filter(a => a.assignedDate === rawDate && staffIds.includes(a.staffId)));
    } catch (err) {
      console.log(err);
      const message = 'Fetch phân ca thất bại!';
      toast.error(message, {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      // do something for example setLoading
    }
  }    

  useEffect(() => {    
    fetchStaffs();
    fetchStaffAssignments();
  }, [])  

  const handleDelete = async (id: number) => {
    try {
        await staffAssignmentService.deleteStaffAssignment(String(id));
        const message = 'Xóa ca làm thành công!';
        toast.success(message, {
            duration: 3000,
            position: 'top-right',
        });        
        window.location.reload();
    } catch (err) {
        console.log(err);
        const message = 'Xóa ca làm thất bại!';
        toast.error(message, {
            duration: 3000,
            position: 'top-right',
        });
    }
  }

  const handleTakeAttendance = async (shiftId: number) => {
    router.push(`/park-branches/${id}/shift-calendar/shifts/` + shiftId);
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
                    Điểm Danh Đến
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-lg dark:text-gray-400"
                  >
                    Điểm Danh Về
                  </TableCell>                  
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-lg dark:text-gray-400"
                  >
                    Action
                  </TableCell>                                             
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {staffAssignments.map((assignment, index) => (
                  <TableRow key={assignment.id}>                  
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {index + 1}
                    </TableCell>                  
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {assignment.staffName}
                    </TableCell>                         
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">                      
                      {assignment?.scanInAt ? assignment.scanInAt : "Chưa điểm danh"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">                      
                      {assignment?.scanInAt ? assignment.scanInAt : "Chưa điểm danh"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400 flex justify-center items-center gap-2">
                      {new Date(rawDate!) > new Date() && (
                      <Button 
                        size="sm" 
                        variant="danger" 
                        onClick={() => handleDelete(assignment.id)}
                      >
                        Hủy Ca
                      </Button>
                      )}

                      {/* Take attendance on same day or future (test) */}
                      {new Date(rawDate!) >= new Date(new Date().toISOString().split("T")[0]) && (
                      <Button 
                        size="sm" 
                        variant="primary"
                        onClick={() => handleTakeAttendance(assignment.id)}                        
                      >
                        Điểm Danh
                      </Button>
                      )}
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
