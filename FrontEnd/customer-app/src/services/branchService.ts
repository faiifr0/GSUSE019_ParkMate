import axiosClient from '../api/axiosClient';

export interface Branch {
  id: number;
  name: string;
  lat: number;
  lon: number;
  address?: string;
  open?: string;
  close?: string;
}

// Dữ liệu gốc từ API có location là string
interface BranchRaw extends Omit<Branch, 'lat' | 'lon'> {
  location: string;
}

const branchService = {
  getAll: async (): Promise<Branch[]> => {
    const res = await axiosClient.get<BranchRaw[]>('/park-branch');
    const parsed: Branch[] = res.data.map((b) => {
      const [lat, lon] = b.location.split(',').map(Number);
      return { ...b, lat, lon };
    });
    return parsed;
  }
};

export default branchService;
