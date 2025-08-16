import axiosClient from '../api/axiosClient';
import { BranchPromotion } from '../types/BranchPromotion';

const branchPromotionService = {
  // Lấy tất cả promotions
  getAll: async (): Promise<BranchPromotion[]> => {
    const res = await axiosClient.get<BranchPromotion[]>('/branch-promotion');
    return res.data;
  },

  // Lấy chi tiết 1 promotion theo id
  getById: async (id: number): Promise<BranchPromotion> => {
    const res = await axiosClient.get<BranchPromotion>(`/branch-promotion/${id}`);
    return res.data;
  },

  // Nếu muốn lọc theo chi nhánh (client side)
  getByBranchId: async (branchId: number): Promise<BranchPromotion[]> => {
    const all = await branchPromotionService.getAll();
    return all.filter(promo => promo.parkBranchId === branchId);
  }
};

export default branchPromotionService;
