import axiosClient from "../axiosClient";
import { staffAssignmentCreateModel } from "@/lib/model/staffAssignmentCreateModel";
import { staffAssignmentUpdateModel } from "@/lib/model/staffAssignmentUpdateModel";

export type staffAssignmentResponse = {
  id: number;
  staffId: string;
  staffName: string;
  shiftId: string;
  assignedDate: string;
  createdAt: string;        
  updatedAt: string; 
  scanInAt: string;
  scanOutAt: string;
};

const staffAssignmentService = {
  getAll: async(): 
    Promise<staffAssignmentResponse[]> => {
    try {
      const res = await axiosClient.get<staffAssignmentResponse[]>("/staff-assignments");
      return res.data;
    } catch (error) {
      console.error("❌ Error get all staff assignment: ", error);
      throw error;
    }
  },

  getStaffAssignmentById: async (id: string): Promise<staffAssignmentResponse> => {
    try {
      const res = await axiosClient.get<staffAssignmentResponse>(`/staff-assignments/${id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching staff assignment id {" + id + "} :", error);
      throw error;
    }
  },

  createStaffAssignment: async (    
    model?: staffAssignmentCreateModel
  ): Promise<staffAssignmentResponse> => {
    try {
      const res = await axiosClient.post<staffAssignmentResponse>("/staff-assignments", model);
      return res.data;
    } catch (error) {
      console.error("❌ Error create staff assignment: ", error);
      throw error;
    }
  },

  updateStaffAssignment: async (
    id: string, 
    model?: staffAssignmentUpdateModel
  ): Promise<staffAssignmentResponse> => {
    try {
      const res = await axiosClient.put<staffAssignmentResponse>(`/staff-assignments/${id}`, model);
      return res.data;
    } catch (error) {
      console.error("❌ Error update staff assignment {" + id + "} :", error);
      throw error;
    }
  },

  deleteStaffAssignment: async (
    id: string,     
  ): Promise<void> => {
    try {
      const res = await axiosClient.delete<staffAssignmentResponse>(`/staff-assignments/${id}`);      
    } catch (error) {
      console.error("❌ Error delete staff assignment {" + id + "} :", error);
      throw error;
    }
  },
};

export default staffAssignmentService;
