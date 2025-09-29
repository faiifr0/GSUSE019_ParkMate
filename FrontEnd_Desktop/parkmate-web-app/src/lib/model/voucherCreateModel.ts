export type voucherCreateModel = {  
  parkBranchId?: string;
  code?: string;
  percent?: number;
  maxDiscount?: number;
  startAt?: string;
  endAt?: string;
  active?: boolean;  
}