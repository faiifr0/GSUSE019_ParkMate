import axiosClient from "../lib/axiosClient";
import {parkBranchUpdateModel} from "@/model/parkBranchUpdateModel";

export type branchTicketTypeResponse = {
  name: string;
  description: string;
  basePrice: number;
  isCancelable: boolean;
  startTime: string;
  endTime: string;
};

const branchTicketTypeService = {
  getAll: async(): 
    Promise<branchTicketTypeResponse[]> => {
    try {
      const res = await axiosClient.get<branchTicketTypeResponse[]>("/ticket-type");
      return res.data;
    } catch (error) {
      console.error("❌ Error get all branch ticket type:", error);
      throw error;
    }
  },

  getTicketTypeById: async (id: string): Promise<branchTicketTypeResponse> => {
    try {
      const res = await axiosClient.get<branchTicketTypeResponse>(`/ticket-type/${id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching branch ticket type id {" + id + "} :", error);
      throw error;
    }
  },

  updateTicketType: async (
    id: string, 
    model?: parkBranchUpdateModel
  ): Promise<branchTicketTypeResponse> => {
    try {
      const res = await axiosClient.put<branchTicketTypeResponse>(`/ticket-type/${id}`, model);
      return res.data;
    } catch (error) {
      console.error("❌ Error update branch ticket type id {" + id + "} :", error);
      throw error;
    }
  },
};

export default branchTicketTypeService;
