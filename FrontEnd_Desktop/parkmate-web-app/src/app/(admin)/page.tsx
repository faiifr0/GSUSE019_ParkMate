"use client";
import React, { useEffect } from "react";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import CustomerStatisticsChart from "@/components/ecommerce/CustomerStatisticsChart";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { currUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currUser) return;

    const isAdmin = currUser.roles?.includes("ADMIN");
    const isManager = currUser.roles?.includes("MANAGER");

    const isAuthorized = isAdmin || isManager;

    if (!isAuthorized) {
      router.replace("/error-403");
    }
  }, [currUser, router]);

  const isAdmin = currUser?.roles?.includes("ADMIN");
  const isManager = currUser?.roles?.includes("MANAGER");  

  const isAuthorized = isAdmin || isManager;

  if (!currUser || !isAuthorized) {
    return null; // prevent rendering before redirect
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      {(currUser?.parkBranchId || currUser.roles?.includes("ADMIN")) ? (
        <>
          <div className="col-span-12 space-y-6 xl:col-span-12">
            <EcommerceMetrics />
          </div>

          <div className="col-span-12">
            <MonthlySalesChart />
          </div>

          <div className="col-span-12">
            <CustomerStatisticsChart />
          </div>      
        </>
      ) : (
        <div className="col-span-12 text-center text-gray-500">
          Bạn không được phân công quản lý chi nhánh nào. Vui lòng liên hệ quản trị viên.
        </div>
      )}      
    </div>
  )
}