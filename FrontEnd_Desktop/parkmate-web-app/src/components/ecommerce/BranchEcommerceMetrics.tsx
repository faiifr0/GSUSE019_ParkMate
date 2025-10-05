"use client";
import React, { useEffect, useMemo, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon, ShootingStarIcon } from "@/components/icons";
import userService from "@/lib/services/userService";
import orderService, { orderResponse } from "@/lib/services/orderService";
import { useAuth } from "../context/AuthContext";
import reviewService, { ReviewResponse } from "@/lib/services/reviewService";

export const BranchEcommerceMetrics = () => {
  const { currUser } = useAuth();

  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [newOrders, setNewOrders] = useState<orderResponse[]>([]);
  const [thisMonthRevenue, setthisMonthRevenue] = useState<number>(0);

  const fetchReviews = async () => {
    try {
      const response = await reviewService.getAllOfBranch(currUser?.parkBranchId.toString() || "1");            

      setReviews(response);
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
        order.parkBranchId === currUser?.parkBranchId &&
        new Date(order.createdAt).getMonth() === currentMonth &&
        new Date(order.createdAt).getFullYear() === currentYear
      );

      console.log("newOrdersThisMonth", newOrdersThisMonth);

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

  const averageRating = useMemo(() => {
    const approvedReviews = reviews.filter(review => review.approved);
    const totalRating = approvedReviews.reduce((sum, review) => sum + review.rating, 0);
    return approvedReviews.length > 0 ? totalRating / approvedReviews.length : 0;
  }, [reviews]);

  useEffect(() => {
    fetchReviews();
    fetchNewOrders();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <ShootingStarIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Đánh giá chi nhánh
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {averageRating.toFixed(2)} / 5
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
              {thisMonthRevenue.toLocaleString('vi-VN')} ₫
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
