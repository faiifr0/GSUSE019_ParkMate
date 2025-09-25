import axiosClient from "../axiosClient";

export type shiftResponse = {
  id: number;
  startTime: string;      
  endTime: string;       
  description: string;  
  daysOfWeek: string;
};

const shiftService = {
  getAll: async(): 
    Promise<shiftResponse[]> => {
    try {
      const res = await axiosClient.get<shiftResponse[]>("/shift");
      return res.data;
    } catch (error) {
      console.error("❌ Error get all shifts: ", error);
      throw error;
    }
  },

  getShiftById: async (id: string): Promise<shiftResponse> => {
    try {
      const res = await axiosClient.get<shiftResponse>(`/shift/${id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching shift id {" + id + "} :", error);
      throw error;
    }
  },
};

export default shiftService;
