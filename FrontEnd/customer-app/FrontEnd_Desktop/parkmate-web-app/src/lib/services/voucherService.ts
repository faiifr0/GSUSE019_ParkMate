import axiosClient from "../axiosClient";
import { voucherCreateModel } from "../model/voucherCreateModel";
import { voucherUpdateModel } from "../model/voucherUpdateModel";

export type VoucherResponse = {
  id: string;
  parkBranchId: string;
  code: string;
  percent: number;
  maxDiscount: number;
  startAt: string;
  endAt: string;
  active: boolean;
};

const voucherService = {
  getAll: async(): 
    Promise<VoucherResponse[]> => {
    try {
      const res = await axiosClient.get<VoucherResponse[]>("/vouchers");
      return res.data;
    } catch (error) {
      console.error("❌ Error get all branch vouchers: ", error);
      throw error;
    }
  },

  getVoucherById: async (id: string): Promise<VoucherResponse> => {
    try {
      const res = await axiosClient.get<VoucherResponse>(`/vouchers/${id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching branch voucher id {" + id + "} : ", error);
      throw error;
    }
  },

  createVoucher: async (model?: voucherCreateModel): Promise<VoucherResponse> => {
    try {
      const res = await axiosClient.post<VoucherResponse>(`/vouchers`, model);
      return res.data;
    } catch (error) {
      console.error("❌ Error create branch voucher : ", error);
      throw error;
    }
  },

  updateVoucher: async (
    id: string, 
    model: voucherUpdateModel
  ): Promise<VoucherResponse> => {
    try {
      const res = await axiosClient.put<VoucherResponse>(`/vouchers/${id}`, model);
      return res.data;
    } catch (error) {
      console.error("❌ Error update branch voucher id {" + id + "} : ", error);
      throw error;
    }
  },
};

export default voucherService;
