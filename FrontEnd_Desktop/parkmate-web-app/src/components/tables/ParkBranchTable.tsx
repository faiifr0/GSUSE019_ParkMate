'use client';
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
//import Image from "next/image";

import Pagination from "./Pagination";

interface Branch {
  id: number;
  name: string;
  address: string;
  location: string;
  open_hour: string;
  close_hour: string;
  status: string;
}

// Define the table data using the interface
const tableData: Branch[] = [
  {
    id: 1,
    name: "Lindsey Curtis",
    address: "A Street",
    location: "A Location",
    open_hour: "9:00",
    close_hour: "22:00",
    status: "Active",
  },
  {
    id: 2,
    name: "Kaiya George",
    address: "B Street",
    location: "B Location",
    open_hour: "9:00",
    close_hour: "22:00",
    status: "Active",
  },
  {
    id: 3,
    name: "Zain Geidt",
    address: "C Street",
    location: "C Location",
    open_hour: "8:00",
    close_hour: "21:00",
    status: "Pending",
  },
  {
    id: 4,
    name: "Abram Schleifer",
    address: "D Street",
    location: "D Location",
    open_hour: "9:00",
    close_hour: "23:00",
    status: "Pending",
  },
  {
    id: 5,
    name: "Carla George",
    address: "A Street",
    location: "A Location",
    open_hour: "14:00",
    close_hour: "0:00",
    status: "Not Available",
  },
];

// Handle what happens when you click on the pagination
const handlePageChange = (page: number) => {};

//test api
//const url_db = "https://parkmate-management-system.azurewebsites.net/api/park-branch";
const url_test = "https://api.genderize.io?name=luc";

const response = await fetch(url_test, {
  method: 'GET',
  // headers: {
  //   'Content-Type': 'application/json',
  //   'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYW5hZ2VyMDBAZ21haWwuY29tIiwidXNlcklkIjo1LCJpYXQiOjE3NTU4NTU2ODIsImV4cCI6MTc2MTAzOTY4Mn0.1LrtDwgWQVRBwlwKJsmMM9MGnbAzE8hU8207GnEB1ww`,          
  // }
});
//------------------------------------------------------------------------------------------

const data = await response.json();

export default function UserTable() {
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
                  Location
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
                  Status
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {tableData.map((branch) => (
                <TableRow key={branch.id}>
                  <a href={"/park-branches/" + branch.id} className="text-center">
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {branch.name}
                    </TableCell>
                  </a>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {branch.address}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {branch.location}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {branch.open_hour}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {branch.close_hour}
                  </TableCell>                  
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        branch.status === "Active"
                          ? "success"
                          : branch.status === "Pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {branch.status}
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

      <div className="border border-gray-500 text-center text-gray-800 text-theme-lg">                  
        {JSON.stringify(data)}
      </div>
    </div>
  );
}
