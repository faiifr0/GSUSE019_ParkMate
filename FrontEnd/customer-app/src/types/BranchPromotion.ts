export interface BranchPromotion {
  id: number;
  parkBranchId: number;
  description: string;
  discount: number;
  from: string;
  to: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  image?: string;
}
