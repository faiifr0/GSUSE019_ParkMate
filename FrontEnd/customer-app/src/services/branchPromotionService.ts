import axiosClient from '../api/axiosClient';

export interface BranchPromotion {
  id: number;
  branchId: number;
  description: string;
  discount: number;
  image?: string;
}

const branchPromotionService = {
  getByBranchId: async (branchId: number): Promise<BranchPromotion[]> => {
    const res = await axiosClient.get<BranchPromotion[]>(`/branch-promotions/${branchId}`);
    return res.data;
  }
};

export default branchPromotionService;
