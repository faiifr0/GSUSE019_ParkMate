import React from "react";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import CustomerStatisticsChart from "@/components/ecommerce/CustomerStatisticsChart";

export default function AdminDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <EcommerceMetrics />
      </div>

      <div className="col-span-12">
        <MonthlySalesChart />
      </div>

      <div className="col-span-12">
        <CustomerStatisticsChart />
      </div>
    </div>
  )
}