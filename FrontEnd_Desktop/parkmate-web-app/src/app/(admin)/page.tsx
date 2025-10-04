"use client";
import React, { useEffect, useState } from "react";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import CustomerStatisticsChart from "@/components/ecommerce/CustomerStatisticsChart";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import BranchMonthlySalesChart from "@/components/ecommerce/BranchMonthlySalesChart";
import Cookies from "js-cookie";
import { BranchEcommerceMetrics } from "@/components/ecommerce/BranchEcommerceMetrics";
import parkBranchService, { parkBranchResponse } from "@/lib/services/parkBranchService";

export default function AdminDashboard() {
  const { currUser } = useAuth();
  const router = useRouter();

  const [branchInfo, setBranchInfo] = useState<parkBranchResponse>(); 
  const fetchParkBranch = async () => {
    try {
      const response = await parkBranchService.getParkBranchById(String(currUser?.parkBranchId || "1"));
      setBranchInfo(response);  
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!currUser) return;

    const isAdmin = currUser.roles?.includes("ADMIN");
    const isManager = currUser.roles?.includes("MANAGER");

    const isAuthorized = isAdmin || isManager;

    if (!isAuthorized) {
      //router.replace("/error-403");
      Cookies.remove("token", {path: "/"});
      router.push("/signin");
    }

    if (isManager) fetchParkBranch();
    
  }, [currUser, router]);

  const isAdmin = currUser?.roles?.includes("ADMIN");
  const isManager = currUser?.roles?.includes("MANAGER");  

  const isAuthorized = isAdmin || isManager;

  if (!currUser || !isAuthorized) {
    return null; // prevent rendering before redirect
  }

  return (
    <>
      {(currUser.roles?.includes("ADMIN") && (
      <ComponentCard title="Thống kê tổng quan toàn hệ thống">
        <div className="grid grid-cols-12 gap-4 md:gap-6">            
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
        </div>
      </ComponentCard>
    ))}

      {(currUser.roles?.includes("MANAGER") && currUser?.parkBranchId !== 0 && (
      <ComponentCard title={"Thống kê tổng quan chi nhánh " + (branchInfo ? (" " + branchInfo.name) : "")}>
        <div className="grid grid-cols-12 gap-4 md:gap-6">            
          <>
            <div className="col-span-12 space-y-6 xl:col-span-12">
              <BranchEcommerceMetrics />
            </div>

            <div className="col-span-12">
              <BranchMonthlySalesChart />
            </div>                 
          </>
        </div>
      </ComponentCard>
      ))}  

      {(currUser && currUser.roles?.includes("MANAGER") && currUser?.parkBranchId === 0 && (
      <div className="col-span-12 text-center text-gray-900">
        Bạn không được phân công quản lý chi nhánh nào. Vui lòng liên hệ quản trị viên.
      </div>
      ))}                  
    </>
  )
}