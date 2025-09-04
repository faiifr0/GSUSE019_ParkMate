'use client';
import React from "react";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Pagination from "./Pagination";
import parkBranchService from "@/services/parkBranchService";
import { parkBranchResponse } from "@/services/parkBranchService";
import Link from "next/link";

// Handle what happens when you click on the pagination
const handlePageChange = (page: number) => {};

export default function ParkBranchTable() {
  const [branches, setBranches] = useState<parkBranchResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch Park Branches List
  useEffect(() => {
    const fetchParkBranches = async () => {
      try {
        const response = await parkBranchService.getAll();
        setBranches(response);
      } catch (err) {
        console.log(err);
      } finally {
        // do something for example setLoading
      }
    }

    fetchParkBranches();
  }, [])
  
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                >
                  Branch Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                >
                  Address
                </TableCell>                
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                >
                  Open Hour
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                >
                  Close Hour
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                >
                  Created At
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                >
                  Updated At
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {branches.map((branch) => (
                <TableRow key={branch.id}>                  
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    <Link 
                      href={"/park-branches/" + branch.id} 
                      className="text-center block w-full h-full no-underline">                     
                        {branch.name}
                    </Link>                    
                  </TableCell>                  
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {branch.address}
                  </TableCell>                  
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {
                      branch?.open ? 
                      new Date(branch.open).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : ''
                    }
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {
                      branch?.close ? 
                      new Date(branch.close).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : ''
                    }
                  </TableCell>                                    
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {branch.createdAt}
                  </TableCell> 
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {branch.updatedAt}
                  </TableCell>                  
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color="error"
                      // color={
                      //   branch.status === "Active"
                      //     ? "success"
                      //     : branch.status === "Pending"
                      //     ? "warning"
                      //     : "error"
                      // }
                    >
                      {/* {branch.status} */}
                      Dubious
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Pagination 
        currentPage={4}
        totalPages={7}
        onPageChange={handlePageChange}
      />     
    </div>
  );
}
