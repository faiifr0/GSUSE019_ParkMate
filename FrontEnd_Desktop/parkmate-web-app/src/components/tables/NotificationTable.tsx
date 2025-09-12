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
import Pagination from "./Pagination";
import notificationService, { notificationResponse } from "@/services/notificationService";
import { format } from 'date-fns';

// Handle what happens when you click on the pagination
const handlePageChange = (page: number) => {}; // eslint-disable-line no-unused-vars

export default function UserTable() {
  const [notifications, setNotifications] = useState<notificationResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch Park Branches List
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationService.getAll();        
        setNotifications(response);
      } catch (err) {
        console.log(err);
      } finally {
        // do something for example setLoading
      }
    }

    fetchNotifications();
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
                  Message
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-lg dark:text-gray-400"
                >
                  Notification Type
                </TableCell>                               
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-lg dark:text-gray-400"
                >
                  Sent At
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
              {notifications.map((notification, index) => (
                <TableRow key={notification.id}>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {index + 1}
                  </TableCell>                  
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {notification.message}
                  </TableCell>                  
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {notification.notificationType}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {format(new Date(notification.sentAt), 'HH:mm dd-MM-yyyy')}
                  </TableCell>                  
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        notification.status === "SENT"
                          ? "success"
                          : notification.status === "PENDING"
                          ? "warning"
                          : "error"
                      }                      
                    >
                      {notification.status}
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
