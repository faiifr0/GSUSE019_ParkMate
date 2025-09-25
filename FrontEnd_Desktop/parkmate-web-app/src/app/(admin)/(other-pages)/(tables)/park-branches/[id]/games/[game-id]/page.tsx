'use client'
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import parkBranchService, { parkBranchResponse } from "@/lib/services/parkBranchService";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import branchAmenityService, { branchAmenityResponse } from "@/lib/services/branchAmenityService";
import gameService, { GameResponse } from "@/lib/services/gameService";
import GameImageCard from "@/components/park-branch/game/GameImageCard";

export default function AmenityImage() {
  const { currUser } = useAuth();
  const router = useRouter();
  const params = useParams();
  const branchId = params.id ? Number(params.id) : 0;
  const gameId = params['game-id'] ? String(params['game-id']) : null;    

  const [branchInfo, setBranchInfo] = useState<parkBranchResponse>(); 
  const [gameInfo, setGameInfo] = useState<GameResponse>();

  const fetchParkBranch = async () => {
    try {
      const response = await parkBranchService.getParkBranchById(String(branchId));
      setBranchInfo(response);  
    } catch (err) {
      console.log(err);
    }
  };

  const fetchGame = async () => {
    try {
      const response = await gameService.getGameById(gameId!);
      setGameInfo(response);  
    } catch (err) {
      console.log(err);
      notFound();
    }
  };

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

  useEffect(() => {
    if (branchId !== 0) {
      fetchParkBranch();
    }    
  }, [branchId]);

  useEffect(() => {
    fetchGame();    
  }, [gameId]);

  if (!currUser) return null;

  const isAdmin = currUser?.roles?.includes("ADMIN");
  const isManager = currUser?.roles?.includes("MANAGER");
  const isBranchMatch = branchId !== 0 && currUser?.parkBranchId !== 0 && branchId === currUser?.parkBranchId;

  const isAuthorized = isAdmin || (isManager && isBranchMatch);

  if (!isAuthorized) {
    return null; // prevent rendering before redirect
  }
  
  if (gameId === null) {
    notFound();
  }

  const breadcrumbItems = currUser.roles.includes("MANAGER")
  ? []
  : [
      { name: "Danh sách chi nhánh", path: "/park-branches" },
      { name: "Thông tin chung của chi nhánh", path: "/park-branches/" + branchId },
      { name: "Các trò chơi của chi nhánh", path: "/park-branches/" + branchId + "/games"}
    ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Ảnh của trò chơi" items={breadcrumbItems}/>
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
      <ComponentCard title={"Ảnh của trò chơi " + gameInfo?.name + " của " + branchInfo?.name}>
        <div className="space-y-6">
          <GameImageCard></GameImageCard>
        </div>
      </ComponentCard>
    </div>
  );
}