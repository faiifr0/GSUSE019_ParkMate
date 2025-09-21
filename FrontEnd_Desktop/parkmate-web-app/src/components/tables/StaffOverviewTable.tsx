'use client';
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";
import branchStaffService, { branchStaffResponse } from "@/lib/services/branchStaffService";
import Button from "../ui/button/Button";

// Handle what happens when you click on the pagination
const handlePageChange = (page: number) => {};

export default function StaffOverviewTable() {
  const params = useParams();
  const id = String(params.id);

  const MANAGER_ROLE_ID = '2';
  const STAFF_ROLE_ID = '3';

  const [staffs, setStaffs] = useState<branchStaffResponse[]>([]);

  // Fetch Staffs List
  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const response = await branchStaffService.getAll();                                                           
        //setStaffs(response.filter(staff => (staff.role?.id?.toString() === STAFF_ROLE_ID || staff.role?.id?.toString() === MANAGER_ROLE_ID) 
                                         //&& staff.parkBranch?.id?.toString() === params.id))         
        // const filtered = response.filter(staff => {
        //   const roleId = staff.role?.id?.toString();
        //   const branchId = staff.parkBranch?.id?.toString();
        //   console.log(`User: ${staff.username}, Role: ${roleId}, Branch: ${branchId}`);
        //   return (
        //     (roleId === STAFF_ROLE_ID || roleId === MANAGER_ROLE_ID) &&
        //     branchId === id
        //   );
        // });

        setStaffs(response);
      } catch (err) {
        console.log(err);
      } finally {
        // do something for example setLoading
      }
    }

    fetchStaffs();
  }, [])

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
                {staffs.map((staff, index) => (
                  <TableRow key={staff.id}>                  
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {index + 1}
                    </TableCell>                  
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {staff.userFullName}
                    </TableCell>     
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">                      
                      {staff.role}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">                      
                      {staff.description}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      <Button size="sm">Phân ca</Button>
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
