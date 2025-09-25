import { parkBranchCreateModel } from "@/lib/model/parkBranchCreateModel";
import axiosClient from "../axiosClient";
import {parkBranchUpdateModel} from "@/lib/model/parkBranchUpdateModel";

export type branchTicketTypeResponse = {
  id: string;
  parkBranchId: string;
  name: string;
  description: string;
  basePrice: number;
  status: boolean;
};

const branchTicketTypeService = {
  getAllOfBranch: async (id: string): 
    Promise<branchTicketTypeResponse[]> => {
    try {
      const res = await axiosClient.get<branchTicketTypeResponse[]>(`/ticket-types/of-branch/${id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Error get all branch ticket types:", error);
      throw error;
    }
  },

  getTicketTypeById: async (id: string): Promise<branchTicketTypeResponse> => {
    try {
      const res = await axiosClient.get<branchTicketTypeResponse>(`/ticket-types/${id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching branch ticket type id {" + id + "} :", error);
      throw error;
    }
  },

  createTicketType: async (
    model?: parkBranchCreateModel
  ): Promise<branchTicketTypeResponse> => {
    try {
      const res = await axiosClient.post<branchTicketTypeResponse>(`/ticket-types`, model);
      return res.data;
    } catch (error) {
      console.error("❌ Error create branch ticket type: ", error);
      throw error;
    }
  },

  updateTicketType: async (
    id: string, 
    model?: parkBranchUpdateModel
  ): Promise<branchTicketTypeResponse> => {
    try {
      const res = await axiosClient.put<branchTicketTypeResponse>(`/ticket-types/${id}`, model);
      return res.data;
    } catch (error) {
      console.error("❌ Error update branch ticket type id {" + id + "} :", error);
      throw error;
    }
  },
};

export default branchTicketTypeService;
