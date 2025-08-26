"use client";

//import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

//import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
//import RecentOrders from "@/components/ecommerce/RecentOrders";
//import DemographicCard from "@/components/ecommerce/DemographicCard";

// export const metadata: Metadata = {
//   title:
//     "ParkMate Manager",
//   description: "This is Next.js Home for ParkMate Dashboard",
// };

export default function Dashboard() {
  const router = useRouter();

  const [loginStatus, setLoginStatus] = useState(true);

  useEffect(() => {
     const token = localStorage.getItem("token");

    if (token) {
      router.replace("/"); // already logged in
    } else {
      router.replace("/signin"); // not logged in
      setLoginStatus(false);
    }
  }, [router]);  

  if (!loginStatus) return null;

  else return (
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <EcommerceMetrics />
        </div>

        <div className="col-span-12">
          <MonthlySalesChart />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>
      </div>
  )
}