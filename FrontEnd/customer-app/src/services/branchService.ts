// src/services/branchService.ts
import axiosClient from "../api/axiosClient";
import { Branch, BranchRaw } from "../types/Branch";

const formatTime = (time?: string) => {
  if (!time) return undefined;
  const date = new Date(time);
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const branchService = {
  getAll: async (): Promise<Branch[]> => {
    const res = await axiosClient.get<BranchRaw[]>("/park-branch");

    return res.data.map((b) => formatBranch(b));
  },

  // 👇 Thêm hàm getById
  getById: async (id: number): Promise<Branch> => {
    const res = await axiosClient.get<BranchRaw>(`/park-branch/${id}`);
    return formatBranch(res.data);
  },
};

// 👉 gom logic parse BranchRaw -> Branch ra thành hàm riêng
const formatBranch = (b: BranchRaw): Branch => {
  let lat = 0,
    lon = 0;
  if (b.location) {
    const [latStr, lonStr] = b.location.split(",");
    const parsedLat = Number(latStr);
    const parsedLon = Number(lonStr);
    if (!isNaN(parsedLat) && !isNaN(parsedLon)) {
      lat = parsedLat;
      lon = parsedLon;
    }
  }

  return {
    id: b.id,
    name: b.name,
    address: b.address,
    lat,
    lon,
    open: formatTime(b.open),
    close: formatTime(b.close),
  };
};

export default branchService;
