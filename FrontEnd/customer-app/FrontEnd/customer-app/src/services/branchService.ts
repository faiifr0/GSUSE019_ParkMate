import axiosClient from "../api/axiosClient";
import { Branch, BranchRaw } from "../types/Branch";

// Chuyển openTime/closeTime sang "HH:mm"
const formatTime = (timeObj?: { hour?: number | null; minute?: number | null }): string | undefined => {
  if (!timeObj || timeObj.hour == null || timeObj.minute == null) return undefined;
  const hh = String(timeObj.hour).padStart(2, "0");
  const mm = String(timeObj.minute).padStart(2, "0");
  return `${hh}:${mm}`;
};

// Chuyển BranchRaw -> Branch
const formatBranch = (b: BranchRaw): Branch => {
  let lat = 0, lon = 0;
  if (b.location) {
    const [latStr, lonStr] = b.location.split(",");
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
    open: formatTime(b.openTime),
    close: formatTime(b.closeTime),
    status: b.status ?? false,
    imageUrl: b.imageUrl ?? "", // dùng imageUrl từ API
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
