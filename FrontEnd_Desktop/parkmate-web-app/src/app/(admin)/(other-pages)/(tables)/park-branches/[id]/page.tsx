'use client'
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useAuth } from "@/components/context/AuthContext";
import BranchImageCard from "@/components/park-branch/BranchImageCard";
import GeographicLocation from "@/components/park-branch/GeographicLocation";
import OverviewInfoCard from "@/components/park-branch/OverviewInfoCard";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import 'trackasia-gl/dist/trackasia-gl.css';

export default function ParkBranchOverview() {
  const { currUser } = useAuth();
  const router = useRouter();
  const params = useParams();
  const branchId = params.id ? Number(params.id) : 0;

  useEffect(() => {
    if (!currUser) return;

    const isAdmin = currUser.roles?.includes("ADMIN");
    const isManager = currUser.roles?.includes("MANAGER");
    const isBranchMatch = branchId !== 0 && currUser.parkBranchId !== 0 && branchId === currUser.parkBranchId;

    const isAuthorized = isAdmin || (isManager && isBranchMatch);

    if (!isAuthorized) {
      router.replace("/error-403");
    }
  }, [currUser, branchId, router]);

  const isAdmin = currUser?.roles?.includes("ADMIN");
  const isManager = currUser?.roles?.includes("MANAGER");
  const isBranchMatch = branchId !== 0 && currUser?.parkBranchId !== 0 && branchId === currUser?.parkBranchId;

  const isAuthorized = isAdmin || (isManager && isBranchMatch);

  if (!currUser || !isAuthorized) {
    return null; // prevent rendering before redirect
  }

  return (
    <div>
      <PageBreadcrumb 
        pageTitle="Thông tin chung của chi nhánh" 
        items={
          currUser.roles.includes("MANAGER")
            ? []
            : [{ name: "Danh sách chi nhánh", path: "/park-branches" }]
        }
      />
      <Toaster
        reverseOrder={false}
        toastOptions={{
          style: {                        
            zIndex: 100000, // cao hơn modal
          },
        }}
        containerStyle={{
          top: 80, // sets spacing from top for the whole stack
        }}
        />
      <ComponentCard title="Thông tin chung của chi nhánh">
        <div>
          <OverviewInfoCard></OverviewInfoCard>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-6 space-y-6">
            <ComponentCard title="Ảnh chi nhánh">
              <div>
                <BranchImageCard></BranchImageCard>                          
              </div>
            </ComponentCard>
          </div>
          <div className="col-span-6 space-y-6">
            <ComponentCard title="Vị trí địa lý">              
                <GeographicLocation></GeographicLocation>                              
            </ComponentCard>
          </div>    
        </div>        
      </ComponentCard>
    </div>
  );
}