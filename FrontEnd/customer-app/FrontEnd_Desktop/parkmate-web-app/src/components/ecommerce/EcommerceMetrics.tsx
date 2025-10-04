"use client";
import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/components/icons";
import userService, { UserResponse } from "@/lib/services/userService";
import orderService, { orderResponse } from "@/lib/services/orderService";

export const EcommerceMetrics = () => {
  const [newCustomers, setNewCustomers] = useState<UserResponse[]>([]);
  const [newOrders, setNewOrders] = useState<orderResponse[]>([]);
  const [thisMonthRevenue, setthisMonthRevenue] = useState<number>(0);

  const fetchNewCustomers = async () => {
    try {
      const response = await userService.getAll();
      
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const newCustomersThisMonth = response.filter(user =>
        user.roles?.some(role => role.roleName === "CUSTOMER") &&
        new Date(user.createdAt).getMonth() === currentMonth &&
        new Date(user.createdAt).getFullYear() === currentYear
      );

      setNewCustomers(newCustomersThisMonth);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchNewOrders = async () => {
    try {
      const customers = (await userService.getAll()).filter(user =>
        user.roles?.some(role => role.roleName === "CUSTOMER")
      );

      const allOrders: orderResponse[] = [];

      for (const customer of customers) {
        const orders = await orderService.getOrdersOfUser(customer.id.toString());
        allOrders.push(...orders); 
      }      
      
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const newOrdersThisMonth = allOrders.filter(order =>
        order.status === "PAID" &&
        new Date(order.details[0].ticketDate).getMonth() === currentMonth &&
        new Date(order.details[0].ticketDate).getFullYear() === currentYear
      );

      setNewOrders(newOrdersThisMonth);

      // Set revenue from new orders this month
      var thisMonthRevenue = 0;

      for (const order of newOrdersThisMonth) {        
        thisMonthRevenue += order.finalAmount;
      }

      setthisMonthRevenue(thisMonthRevenue);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNewCustomers();
    fetchNewOrders();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Khách hàng mới tháng này
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {newCustomers.length}
            </h4>
          </div>
          {/* <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge> */}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Đơn đặt vé mới tháng này
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {newOrders.length}
            </h4>
          </div>

          {/* <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            9.05%
          </Badge> */}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Doanh thu tháng này
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {thisMonthRevenue} ₫
            </h4>
          </div>

          {/* <Badge color="success">
            <ArrowUpIcon />
            25.12%
          </Badge> */}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
