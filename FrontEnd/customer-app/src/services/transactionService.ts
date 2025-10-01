import axiosClient from "../api/axiosClient";
import { Transaction } from "../types/Transaction";

export const transactionService = {
  // Lấy danh sách giao dịch của user (backend lấy userId từ token)
  getOfUser: async (): Promise<Transaction[]> => {
    const res = await axiosClient.get("/transactions/of-user");
    return res.data;
  },

  // Lấy chi tiết một giao dịch theo id
  getById: async (id: number): Promise<Transaction> => {
    const res = await axiosClient.get(`/transactions/${id}`);
    return res.data;
  },
};
