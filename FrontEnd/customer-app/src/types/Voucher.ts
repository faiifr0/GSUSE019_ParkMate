// src/types/Voucher.ts
export interface Voucher {
  id: number;
  parkBranchId: number;
  code: string;
  percent: number;      // vd: 0.1 = 10%
  maxDiscount: number;
  startAt: string;      // ISO string từ backend
  endAt: string;        // ISO string từ backend
  active: boolean;
}
