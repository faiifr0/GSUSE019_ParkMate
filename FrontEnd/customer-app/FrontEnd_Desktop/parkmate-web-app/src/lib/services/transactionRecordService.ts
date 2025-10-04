import axiosClient from "../axiosClient";

export type transactionRecordResponse = {
  id: number;
  amount: number;
  type: string;
  walletId: number;
  createdAt: string;
  updatedAt: string;
};

const transactionRecordService = {
  getAll: async(): 
    Promise<transactionRecordResponse[]> => {
    try {
      const res = await axiosClient.get<transactionRecordResponse[]>("/transactions");
      return res.data;
    } catch (error) {
      console.error("❌ Error get all transaction records: ", error);
      throw error;
    }
  },

  getTransactionRecordById: async (id: string): Promise<transactionRecordResponse> => {
    try {
      const res = await axiosClient.get<transactionRecordResponse>(`/transactions/${id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching transaction record id {" + id + "} :", error);
      throw error;
    }
  },  
};

export default transactionRecordService;
