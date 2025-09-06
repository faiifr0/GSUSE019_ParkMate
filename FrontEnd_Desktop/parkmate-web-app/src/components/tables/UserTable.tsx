'use client';
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import Image from "next/image";
import Pagination from "./Pagination";
import userService, { UserResponse } from "@/services/userService";

// Handle what happens when you click on the pagination
const handlePageChange = (page: number) => {}; // eslint-disable-line no-unused-vars

export default function UserTable() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  // Fetch Park Branches List
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getAll();        
        setUsers(response);
      } catch (err) {
        console.log(err);
      } finally {
        // do something for example setLoading
      }
    }

    fetchUsers();
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
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-lg dark:text-gray-400"
                >
                  No.
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-lg dark:text-gray-400"
                >
                  User
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-lg dark:text-gray-400"
                >
                  Role
                </TableCell>                
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-lg dark:text-gray-400"
                >
                  Wallet
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-lg dark:text-gray-400"
                >
                  Status
                </TableCell>                
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {users.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <Image
                          width={40}
                          height={40}
                          src="/images/user/user-17.jpg"
                          alt={user.username}
                        />
                      </div>
                      <div>
                        <a href={"/users/id?=" + user.id}>
                          <span className="block text-gray-500 text-theme-sm dark:text-white/90">
                            {user.username}
                          </span>
                        </a>
                        {/* <span className="block text-gray-600 text-theme-xs dark:text-gray-400">
                          {order.user.role}
                        </span> */}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {user.role?.id}
                  </TableCell>
                  {/* <TableCell className="px-4 py-3 text-gray-600 text-center text-theme-sm dark:text-gray-400">
                    {order.projectName}
                  </TableCell> */}
                  {/* <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    <div className="flex -space-x-2">
                      {order.team.images.map((teamImage, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                        >
                          <Image
                            width={24}
                            height={24}
                            src={teamImage}
                            alt={`Team member ${index + 1}`}
                            className="w-full"
                          />
                        </div>
                      ))}
                    </div>
                  </TableCell> */}
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {user.wallet?.id}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      // color={
                      //   user.status === "Active"
                      //     ? "success"
                      //     : user.status === "Pending"
                      //     ? "warning"
                      //     : "error"
                      // }
                      color="warning"
                    >
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
