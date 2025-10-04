// branchService.ts
import axiosClient from "../api/axiosClient";
import { Branch, BranchRaw } from "../types/Branch";

// Chuyển "HH:mm:ss" -> "HH:mm"
const formatTime = (timeStr?: string): string | undefined => {
  if (!timeStr) return undefined;
  const [hh, mm] = timeStr.split(":");
  if (!hh || !mm) return undefined;
  return `${hh}:${mm}`;
};

// Chuyển BranchRaw -> Branch
const formatBranch = (b: BranchRaw): Branch => {
  let lat = 0, lon = 0;

  if (b.location) {
    const [latStr, lonStr] = b.location.split(",").map(s => s.trim());
    const parsedLat = Number(latStr);
    const parsedLon = Number(lonStr);
    if (!isNaN(parsedLat)) lat = parsedLat;
    if (!isNaN(parsedLon)) lon = parsedLon;
  }

  return {
    id: b.id,
    name: b.name,
    address: b.address,
    lat,
    lon,
    open: formatTime(b.openTime as string),
    close: formatTime(b.closeTime as string),
    status: b.status ?? false,
    imageUrl: b.imageUrl ?? "",
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  };
};

const branchService = {
  // Lấy tất cả chi nhánh
  getAll: async (): Promise<Branch[]> => {
    const res = await axiosClient.get<BranchRaw[]>("/park-branch");
    return res.data.map(formatBranch);
  },

  // Lấy chi nhánh theo id
  getById: async (id: number): Promise<Branch> => {
    const res = await axiosClient.get<BranchRaw>(`/park-branch/${id}`);
    return formatBranch(res.data);
  },
};

export default branchService;
