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
import userService, { UserResponse } from "@/services/userService";

// Handle what happens when you click on the pagination
const handlePageChange = (page: number) => {}; // eslint-disable-line no-unused-vars

export default function StaffOverviewTable() {
  const params = useParams();
  const id = String(params.id);
  console.log("param id - " + id);

  const MANAGER_ROLE_ID = '2';
  const STAFF_ROLE_ID = '3';

  const [staffs, setStaffs] = useState<UserResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch Users List
  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const response = await userService.getAll();                                                      
        // setStaffs(response.filter(staff => (staff.role?.id === STAFF_ROLE_ID || staff.role?.id === MANAGER_ROLE_ID) 
        //                                  && staff.parkBranch?.id === params.id)) 
        // setStaffs()
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
                    Name
                  </TableCell>  
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-lg dark:text-gray-400"
                  >
                    Role
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
                      {staff.username}
                    </TableCell>     
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {staff.role?.id === MANAGER_ROLE_ID ? "Park Manager" : "Staff"}
                    </TableCell>                              
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>      
      </div>

      <div className="flex justify-end mr-3">
        <button          
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto mt-5"
        >
          {/* <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
            />
          </svg> */}
          See More
        </button>
      </div>
    </>
  );
}
