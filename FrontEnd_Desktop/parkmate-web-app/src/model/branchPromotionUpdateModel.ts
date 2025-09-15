export type branchPromotionUpdateModel = {
  parkBranchId: string;
  description: string;
  discount: number; // must be greater than 0
  from: string;
  to: string;
  isActive: boolean;  
}