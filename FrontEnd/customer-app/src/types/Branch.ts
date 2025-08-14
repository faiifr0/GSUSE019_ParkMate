import axiosClient from '../api/axiosClient';

export interface Branch {
  id: number;
  name: string;
  lat: number;
  lon: number;
  address?: string;
  open: string;
  close: string;
}

const branchService = {
  getAll: async (): Promise<Branch[]> => {
    const res = await axiosClient.get('/park-branch');
    const parsed = res.data.map((b: any) => {
      const [lat, lon] = b.location.split(',').map(Number);
      return { ...b, lat, lon };
    });
    return parsed as Branch[];
  }
};

export default branchService;
