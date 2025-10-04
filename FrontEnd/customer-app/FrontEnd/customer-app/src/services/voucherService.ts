// src/services/voucherService.ts
import axiosClient from "../api/axiosClient";
import { Voucher } from "../types/Voucher";

// format voucher từ backend → frontend
const formatVoucher = (v: Voucher): Voucher => {
  return {
    ...v,
    startAt: new Date(v.startAt).toISOString(),
    endAt: new Date(v.endAt).toISOString(),
  };
};

// service cho khách (chỉ GET, không tạo/sửa/xoá)
const voucherService = {
  // Lấy tất cả voucher
  getAll: async (): Promise<Voucher[]> => {
    const res = await axiosClient.get<Voucher[]>("/vouchers");
    return res.data.map(formatVoucher);
  },

  // Lấy voucher theo id
  getById: async (id: number): Promise<Voucher> => {
    const res = await axiosClient.get<Voucher>(`/vouchers/${id}`);
    return formatVoucher(res.data);
  },

  // Lọc voucher theo branchId (client side)
  getByBranchId: async (branchId: number): Promise<Voucher[]> => {
    const all = await voucherService.getAll();
    return all.filter(v => v.parkBranchId === branchId);
  },

  // Kiểm tra voucher còn hiệu lực không (so với thời gian hiện tại)
  isValidNow: (voucher: Voucher): boolean => {
    const now = new Date();
    return (
      voucher.active &&
      new Date(voucher.startAt) <= now &&
      now <= new Date(voucher.endAt)
    );
  },

  // Tính giá trị giảm giá cho đơn hàng
  calcDiscount: (voucher: Voucher, amount: number): number => {
    if (!voucherService.isValidNow(voucher)) return 0;
    const discount = amount * voucher.percent;
    return Math.min(discount, voucher.maxDiscount);
  },
};

export default voucherService;
